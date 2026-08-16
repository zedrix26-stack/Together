/* =====================================================
   TOGETHER SYNC ENGINE
   Supabase backend (Postgres + Realtime + Storage +
   anonymous auth) for cross-device couple sharing.
   Local-first: IndexedDB remains the offline cache;
   Supabase mirrors and syncs the couple.
   ===================================================== */
(function () {
    'use strict';
    window.DEBUG_SYNC = true;

    var CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var CODE_LENGTH = 6;
    var STORE_COLLECTIONS = ['photos', 'memories', 'moments', 'milestones', 'chat'];
    var BUCKET = 'couple-media';
    var LS_COUPLE_ID = 'together_couple_id';
    var LS_COUPLE_CODE = 'together_couple_code';

    function uid() {
        return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
    }
    function randomString(len) {
        var out = [];
        for (var i = 0; i < len; i++) out.push(CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]);
        return out.join('');
    }
    function normalizeCode(code) {
        return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    function debounce(fn, ms) {
        var t;
        return function () {
            var args = arguments, ctx = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(ctx, args); }, ms);
        };
    }

    /* In-memory cache: storagePath -> dataURL.
       Persisted image bytes live in IndexedDB (local store). */
    function cachedImage(path) {
        return Sync._imageCache[path] || null;
    }
    function cacheImage(path, dataUrl) {
        if (!path) return;
        Sync._imageCache[path] = dataUrl;
        var keys = Object.keys(Sync._imageCache);
        if (keys.length > 80) {
            for (var i = 0; i < keys.length - 80; i++) delete Sync._imageCache[keys[i]];
        }
    }

    var Sync = {
        ready: false,
        authed: false,
        client: null,
        coupleId: null,
        memberId: null,
        profileId: null,
        status: 'idle',
        currentCode: null,
        coupleDoc: null,
        onStatus: null,
        onCouple: null,
        onData: null,
        onPresence: null,
        localPut: null,
        localGet: null,
        localDel: null,
        onRemoteDelete: null,
        _imageCache: {},
        _signedUrls: {},
        _storeCache: { photos: {}, memories: {}, moments: {}, milestones: {}, chat: {} },
        _coupleRow: null,
        _membersRows: [],
        _channel: null,
        _delChannel: null,
        _channelStatus: null,
        _partnerOnline: false,
        _pending: 0,
        _pendingAttach: null,
        _timers: {}
    };

    function emitStatus() {
        if (Sync.onStatus) Sync.onStatus(Sync.status);
    }

    function dbg() {
        if (!window.DEBUG_SYNC) return;
        try {
            var a = ['[SYNC]'].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, a);
        } catch (e) {}
    }
    function findMember(no) {
        return (Sync._membersRows || []).find(function (m) { return m.member_no === no; }) || null;
    }

    function dataUrlToBlob(dataUrl) {
        var m = /^data:([^;,]+)(;base64)?,(.*)$/.exec(dataUrl);
        if (!m) return null;
        var type = m[1] || 'image/jpeg';
        var bin = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new Blob([bytes], { type: type });
    }

    function fetchImageDataUrl(path) {
        var cached = cachedImage(path);
        if (cached) return Promise.resolve(cached);
        return Sync.getSharedPhotoUrl(path).then(function (url) {
            if (!url) throw new Error('no-url');
            dbg('fetch bytes', path, url.slice(0, 90));
            return fetch(url);
        }).then(function (resp) {
            if (!resp.ok) throw new Error('http ' + resp.status);
            return resp.blob();
        }).then(function (blob) {
            return new Promise(function (resolve, reject) {
                var r = new FileReader();
                r.onload = function () { resolve(r.result); };
                r.onerror = function () { reject(r.error || new Error('read')); };
                r.readAsDataURL(blob);
            });
        });
    }

    /* Signed URL for a file in the PRIVATE couple-media bucket.
       Each device generates its own URL using its own authenticated
       session (1-hour expiry, cached per path). The <img> tag loads the
       URL directly; RLS on the storage bucket gates who can get one. */
    Sync.getSharedPhotoUrl = function (path) {
        if (!path) return Promise.resolve(null);
        if (Sync._signedUrls[path]) return Promise.resolve(Sync._signedUrls[path]);
        return Sync.client.storage.from(BUCKET).createSignedUrl(path, 3600).then(function (res) {
            if (res.error) throw res.error;
            var u = (res.data && res.data.signedUrl) || null;
            if (u) Sync._signedUrls[path] = u;
            dbg('signed url', path, u ? 'ok' : 'missing');
            return u;
        }).catch(function (e) {
            dbg('signed url FAILED', path, e && e.message);
            throw e;
        });
    };

    /* Transient network failures should not permanently kill an image:
       retry signing a few times with backoff before giving up. */
    function signWithRetry(path, attempts) {
        attempts = attempts || 3;
        var tryOnce = function (n) {
            return Sync.getSharedPhotoUrl(path).catch(function (e) {
                if (n >= attempts) throw e;
                var wait = 1200 * n;
                dbg('sign retry', path, 'attempt', n, 'in', wait + 'ms');
                return new Promise(function (resolve) {
                    setTimeout(resolve, wait);
                }).then(function () {
                    return tryOnce(n + 1);
                });
            });
        };
        return tryOnce(1);
    }

    function recToRow(store, rec, coupleId, storagePath) {
        var row = {
            id: String(rec.id),
            couple_id: coupleId,
            storage_path: storagePath || null,
            created_by: Sync.profileId || null
        };
        /* Chat uses the server-assigned created_at (single authoritative clock)
           so both phones sort messages identically regardless of device clocks. */
        if (store !== 'chat') row.created_at = rec.createdAt || Date.now();
        if (store === 'photos') {
            row.caption = rec.caption || '';
            row.date = rec.date || '';
        } else if (store === 'memories') {
            row.title = rec.title || '';
            row.date = rec.date || '';
            row.description = rec.description || '';
        } else if (store === 'moments') {
            row.title = rec.title || '';
            row.date = rec.date || '';
            row.category = rec.category || 'Other';
            row.description = rec.description || '';
        } else if (store === 'milestones') {
            row.title = rec.title || '';
            row.date = rec.date || '';
            row.description = rec.description || '';
        } else if (store === 'chat') {
            row.sender = rec.sender || '';
            row.sender_name = rec.senderName || '';
            row.text = rec.text || '';
            row.kind = rec.kind || 'text';
        }
        return row;
    }

    function rowToRec(store, row) {
        var rec = {
            id: row.id,
            profileId: String(row.couple_id),
            createdAt: row.created_at || Date.now()
        };
        if (store === 'photos') {
            rec.caption = row.caption || '';
            rec.date = row.date || '';
            rec.storagePath = row.storage_path || '';
            rec.photoUrl = rec.storagePath ? (Sync._signedUrls[rec.storagePath] || '') : '';
            rec.data = rec.storagePath ? cachedImage(rec.storagePath) || null : null;
        } else if (store === 'memories') {
            rec.title = row.title || '';
            rec.date = row.date || '';
            rec.description = row.description || '';
            rec.storagePath = row.storage_path || '';
            rec.photoUrl = rec.storagePath ? (Sync._signedUrls[rec.storagePath] || '') : '';
            rec.photo = rec.storagePath ? cachedImage(rec.storagePath) || null : null;
        } else if (store === 'moments') {
            rec.title = row.title || '';
            rec.date = row.date || '';
            rec.category = row.category || 'Other';
            rec.description = row.description || '';
            rec.storagePath = row.storage_path || '';
            rec.photoUrl = rec.storagePath ? (Sync._signedUrls[rec.storagePath] || '') : '';
            rec.photo = rec.storagePath ? cachedImage(rec.storagePath) || null : null;
        } else if (store === 'milestones') {
            rec.title = row.title || '';
            rec.date = row.date || '';
            rec.description = row.description || '';
        } else if (store === 'chat') {
            rec.sender = row.sender || '';
            rec.senderName = row.sender_name || '';
            rec.text = row.text || '';
            rec.kind = row.kind || 'text';
            rec.storagePath = row.storage_path || '';
            rec.photoUrl = rec.storagePath ? (Sync._signedUrls[rec.storagePath] || '') : '';
            rec.photo = rec.storagePath ? cachedImage(rec.storagePath) || null : null;
        }
        return rec;
    }

    function toLocalCouple(coupleId, row, m1, m2) {
        var meta = {
            relationshipStartDate: row.start_date || '',
            favoritePlace: row.favorite_place || '',
            favoriteActivity: row.favorite_activity || '',
            note: row.note || '',
            partnerName: (m2 && m2.name) || '',
            createdAt: row.created_at ? new Date(row.created_at).getTime() : 0
        };
        var members = {
            member1: {
                id: (m1 && m1.profile_id) || '',
                name: (m1 && m1.name) || 'Person 1',
                photo: (m1 && m1.avatar_path) ? cachedImage(m1.avatar_path) || null : null,
                joinedAt: (m1 && m1.joined_at) || null
            },
            member2: {
                id: (m2 && m2.profile_id) || '',
                name: (m2 && m2.name) || 'Partner',
                photo: (m2 && m2.avatar_path) ? cachedImage(m2.avatar_path) || null : null,
                joinedAt: (m2 && m2.joined_at) || null
            }
        };
        return {
            id: coupleId,
            synced: true,
            memberId: Sync.memberId || '',
            member1: { id: members.member1.id, name: members.member1.name, photo: members.member1.photo },
            member2: {
                id: members.member2.id,
                name: members.member2.name,
                photo: members.member2.photo,
                joined: !!members.member2.id,
                joinedAt: members.member2.joinedAt,
                online: false
            },
            person1: { name: members.member1.name, photo: members.member1.photo, memberId: members.member1.id },
            person2: { name: members.member2.name, photo: members.member2.photo, memberId: members.member2.id, joined: !!members.member2.id },
            startDate: meta.relationshipStartDate,
            favoritePlace: meta.favoritePlace,
            favoriteActivity: meta.favoriteActivity,
            note: meta.note,
            inviteCode: Sync.currentCode || null,
            createdAt: meta.createdAt,
            _meta: meta,
            _members: members
        };
    }

    function emitCoupleOnce() {
        var self = Sync;
        if (!self._coupleRow) return;
        var m1 = findMember(1) || {};
        var m2 = findMember(2) || {};
        var couple = toLocalCouple(String(self._coupleRow.id), self._coupleRow, m1, m2);
        couple.member2.online = !!self._partnerOnline;
        couple.person2.online = !!self._partnerOnline;
        self.coupleDoc = { id: couple.id, meta: couple._meta, members: couple._members };
        if (self.onCouple) self.onCouple(couple);
    }

    function emitCoupleDebounced() {
        var self = Sync;
        if (self._timers.couple) clearTimeout(self._timers.couple);
        self._timers.couple = setTimeout(function () {
            emitCoupleOnce();
            materializeAvatars();
        }, 150);
    }

    function materializeAvatars() {
        var self = Sync;
        if (!self._coupleRow) return;
        [1, 2].forEach(function (no) {
            var m = findMember(no);
            if (!m || !m.avatar_path || cachedImage(m.avatar_path)) return;
            fetchImageDataUrl(m.avatar_path).then(function (d) {
                cacheImage(m.avatar_path, d);
                emitCoupleOnce();
            }).catch(function () {});
        });
    }

    function emitStoreDebounced(store) {
        var self = Sync;
        if (self._timers['emit:' + store]) clearTimeout(self._timers['emit:' + store]);
        self._timers['emit:' + store] = setTimeout(function () {
            if (!self.onData || !self.coupleId) return;
            var rows = self._storeCache[store] || {};
            var recs = [];
            Object.keys(rows).forEach(function (id) { recs.push(rowToRec(store, rows[id])); });
            self.onData(store, recs);
        }, 120);
    }

    Sync.setPending = function (n) {
        this._pending = Math.max(0, (this._pending || 0) + n);
        this._refreshStatus();
    };

    Sync._refreshStatus = function () {
        if (this._channelStatus == null) return;
        var online = !!navigator.onLine && this._channelStatus === 'SUBSCRIBED';
        if (!online) {
            if (this.status !== 'offline' && this.status !== 'connecting' && this.status !== 'failed' && this.status !== 'idle') {
                this.status = 'offline';
                emitStatus();
            }
            return;
        }
        this.status = this._pending > 0 ? 'syncing' : 'synced';
        emitStatus();
    };

    Sync._watchNetwork = function () {
        var self = this;
        window.addEventListener('online', function () {
            if (self.coupleId) {
                self._loadCoupleDoc();
                STORE_COLLECTIONS.forEach(function (s) { self._loadStore(s); });
            }
            self._refreshStatus();
        });
        window.addEventListener('offline', function () {
            self.status = 'offline';
            emitStatus();
        });
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && self.coupleId) {
                self._loadCoupleDoc();
                STORE_COLLECTIONS.forEach(function (s) { self._loadStore(s); });
            }
        });
    };

    Sync.init = function () {
        var self = this;
        if (!window.supabase || !window.TOGETHER_SUPABASE_CONFIG ||
            !window.TOGETHER_SUPABASE_CONFIG.url || !window.TOGETHER_SUPABASE_CONFIG.anonKey) {
            this.ready = false;
            this.status = 'idle';
            emitStatus();
            return Promise.resolve();
        }
        this.ready = true;
        this.status = 'connecting';
        emitStatus();
        this.client = window.supabase.createClient(
            window.TOGETHER_SUPABASE_CONFIG.url,
            window.TOGETHER_SUPABASE_CONFIG.anonKey,
            { auth: { persistSession: true, autoRefreshToken: true } }
        );
        var restore = this.client.auth.getSession().then(function (s) {
            if (s && s.data && s.data.session) return Promise.resolve();
            return self.client.auth.signInAnonymously();
        });
        return restore.then(function () {
            return self._loadProfile();
        }).then(function () {
            self.authed = true;
            self.memberId = self._profile.id;
            self.profileId = self._profile.id;
            self._watchNetwork();
            try { self.coupleId = localStorage.getItem(LS_COUPLE_ID) || null; } catch (e) {}
            if (self._pendingAttach) {
                var id = self._pendingAttach;
                self._pendingAttach = null;
                self.attachCouple(id);
            }
            self.status = 'synced';
            emitStatus();
            return Promise.resolve();
        }).catch(function () {
            self.authed = false;
            self.status = 'failed';
            emitStatus();
            return Promise.resolve();
        });
    };

    Sync._loadProfile = function () {
        var self = this;
        return this.client.auth.getUser().then(function (u) {
            var authId = u && u.data && u.data.user && u.data.user.id;
            if (!authId) throw new Error('no-user');
            return self.client.from('profiles').select('*').eq('auth_id', authId).maybeSingle().then(function (res) {
                if (res.error) throw res.error;
                if (res.data) { self._profile = res.data; return Promise.resolve(); }
                return self.client.from('profiles').insert({ auth_id: authId, display_name: '' }).select().single().then(function (ins) {
                    if (ins.error) throw ins.error;
                    self._profile = ins.data;
                });
            });
        });
    };

    Sync.retry = function () {
        return this.init();
    };

    /* =========================================================
       COUPLE LIFECYCLE
       ========================================================= */
    Sync.createCouple = function (opts) {
        var self = this;
        opts = opts || {};
        if (!this.ready || !this.authed) return Promise.reject(new Error('sync-unavailable'));
        return this.client.rpc('create_couple', {
            p_name: String(opts.yourName || '').trim() || 'Person 1',
            p_partner_name: String(opts.partnerName || '').trim(),
            p_start_date: opts.startDate || null
        }).then(function (res) {
            if (res.error) throw self._mapRpcError(res.error);
            var r = res.data || {};
            self.coupleId = r.couple_id;
            self.currentCode = r.code;
            try { localStorage.setItem(LS_COUPLE_ID, r.couple_id); localStorage.setItem(LS_COUPLE_CODE, r.code); } catch (e) {}
            return { coupleId: r.couple_id, code: r.code };
        });
    };

    Sync.regenerateInvite = function () {
        var self = this;
        if (!this.ready || !this.authed || !this.coupleId) return Promise.reject(new Error('sync-unavailable'));
        return this.client.rpc('regenerate_invite', { p_couple_id: this.coupleId }).then(function (res) {
            if (res.error) throw self._mapRpcError(res.error);
            self.currentCode = res.data;
            try { localStorage.setItem(LS_COUPLE_CODE, res.data); } catch (e) {}
            return res.data;
        });
    };

    Sync.joinCouple = function (code, opts) {
        var self = this;
        opts = opts || {};
        if (!this.ready || !this.authed) return Promise.reject(new Error('sync-unavailable'));
        var norm = normalizeCode(code);
        if (!norm) return Promise.reject(new Error('invalid'));
        return this.client.rpc('join_couple', {
            p_code: norm,
            p_name: String(opts.yourName || '').trim()
        }).then(function (res) {
            if (res.error) throw self._mapRpcError(res.error);
            var r = res.data || {};
            self.coupleId = r.couple_id;
            self.currentCode = norm;
            try { localStorage.setItem(LS_COUPLE_ID, r.couple_id); localStorage.setItem(LS_COUPLE_CODE, norm); } catch (e) {}
            return { coupleId: r.couple_id, joined: !!r.joined, couple: r.couple || {} };
        });
    };

    Sync._mapRpcError = function (err) {
        if (!err) return new Error('rpc_error');
        var msg = err.message || err.error_description || err.error || 'rpc_error';
        return new Error(String(msg));
    };

    Sync.deleteCouple = function (coupleId) {
        var self = this;
        if (!this.ready || !this.authed) return Promise.resolve();
        return this._removeCoupleFiles(coupleId).then(function () {
            if (String(coupleId) === String(self.coupleId)) self.detach();
            try { localStorage.removeItem(LS_COUPLE_ID); localStorage.removeItem(LS_COUPLE_CODE); } catch (e) {}
            if (!self.client) return Promise.resolve();
            return self.client.rpc('delete_couple', { p_couple_id: coupleId }).catch(function () {});
        }).catch(function () {});
    };

    Sync._removeCoupleFiles = function (coupleId) {
        var self = this;
        if (!this.client) return Promise.resolve();
        var prefix = 'couples/' + coupleId;
        var out = [];
        return self.client.storage.from(BUCKET).list(prefix, { limit: 100, offset: 0 }).then(function (res) {
            if (res.error) return Promise.resolve();
            var folders = (res.data || []).filter(function (it) { return it && it.name && !it.id; });
            var jobs = folders.map(function (f) {
                return self.client.storage.from(BUCKET).list(prefix + '/' + f.name, { limit: 100, offset: 0 }).then(function (r2) {
                    if (r2.error) return Promise.resolve();
                    (r2.data || []).forEach(function (it) {
                        if (it && it.name && it.id) out.push(prefix + '/' + f.name + '/' + it.name);
                    });
                });
            });
            return Promise.all(jobs);
        }).then(function () {
            if (!out.length) return Promise.resolve();
            return self.client.storage.from(BUCKET).remove(out).catch(function () {});
        });
    };

    /* =========================================================
       ATTACH / SYNC
       ========================================================= */
    Sync.attachCouple = function (coupleId) {
        var self = this;
        if (!this.ready || !this.authed) {
            this._pendingAttach = coupleId || null;
            return;
        }
        this.detach();
        this.coupleId = coupleId;
        try {
            var c = localStorage.getItem(LS_COUPLE_CODE);
            this.currentCode = c || null;
            localStorage.setItem(LS_COUPLE_ID, coupleId);
        } catch (e) {}
        this._channelStatus = null;
        this._loadCoupleDoc();
        STORE_COLLECTIONS.forEach(function (s) { self._loadStore(s); });
        this._subscribe();
        if (this._timers.resign) clearInterval(this._timers.resign);
        this._timers.resign = setInterval(function () { self._refreshSignedUrls(); }, 1200000);
        this._refreshStatus();
    };

    Sync.detach = function () {
        if (this._channel) {
            try { this.client.removeChannel(this._channel); } catch (e) {}
            this._channel = null;
        }
        if (this._delChannel) {
            try { this.client.removeChannel(this._delChannel); } catch (e) {}
            this._delChannel = null;
        }
        this._channelStatus = null;
        this._storeCache = { photos: {}, memories: {}, moments: {}, milestones: {}, chat: {} };
        this._coupleRow = null;
        this._membersRows = [];
        this._partnerOnline = false;
        this.coupleId = null;
        this.coupleDoc = null;
        this.currentCode = null;
        var self = this;
        Object.keys(this._timers).forEach(function (k) { clearTimeout(self._timers[k]); });
        this._timers = {};
    };

    Sync._loadCoupleDoc = function () {
        var self = this;
        this.client.from('couples').select('*').eq('id', this.coupleId).maybeSingle().then(function (res) {
            if (res.error) return;
            self._coupleRow = res.data;
            emitCoupleDebounced();
        });
        this.client.from('couple_members').select('*').eq('couple_id', this.coupleId).then(function (res) {
            if (res.error) return;
            self._membersRows = res.data || [];
            emitCoupleDebounced();
        });
    };

    Sync._loadStore = function (store) {
        var self = this;
        this.client.from(store).select('*').eq('couple_id', this.coupleId).then(function (res) {
            if (res.error) return;
            (res.data || []).forEach(function (row) { self._setRow(store, row); });
            emitStoreDebounced(store);
        });
    };

    Sync._setRow = function (store, row) {
        var self = this;
        if (!row || !row.id) return;
        row._synced = true;
        if (!this._storeCache[store]) this._storeCache[store] = {};
        this._storeCache[store][String(row.id)] = row;
        var path = row.storage_path || null;
        if (path) {
            dbg('RECEIVED', store, 'id=' + row.id, 'couple_id=' + row.couple_id, 'storage_path=' + path, 'created_by=' + row.created_by, 'auth_user=' + (Sync.memberId || ''));
        }
        if (!path) return;
        signWithRetry(path, 3).then(function (u) {
            if (u) {
                dbg('IMAGE URL READY', store, path, u.slice(0, 110));
                emitStoreDebounced(store);
            }
        }).catch(function (e) {
            dbg('IMAGE URL ERROR', store, path, e && e.message);
        });
        var localLookup = function (ok) {
            if (ok) emitStoreDebounced(store);
        };
        if (self.localGet) {
            self.localGet(store, row.id).then(function (local) {
                var img = store === 'photos' ? (local && local.data) : (store === 'milestones' ? null : (local && local.photo));
                if (img && img.indexOf('data:') === 0) {
                    cacheImage(path, img);
                    return;
                }
                fetchImageDataUrl(path).then(function (d) {
                    cacheImage(path, d);
                    localLookup(true);
                }).catch(function () {});
            }).catch(function () {
                fetchImageDataUrl(path).then(function (d) {
                    cacheImage(path, d);
                    localLookup(true);
                }).catch(function () {});
            });
        } else {
            fetchImageDataUrl(path).then(function (d) {
                cacheImage(path, d);
                localLookup(true);
            }).catch(function () {});
        }
    };

    /* Re-sign every cached storage path periodically so the 1-hour
       signed URLs never go stale during a long session. */
    Sync._refreshSignedUrls = function () {
        var self = this;
        var paths = {};
        Object.keys(this._storeCache).forEach(function (store) {
            Object.keys(self._storeCache[store]).forEach(function (id) {
                var p = self._storeCache[store][id].storage_path;
                if (p) paths[p] = store;
            });
        });
        Object.keys(paths).forEach(function (p) {
            signWithRetry(p, 2).then(function (u) {
                if (u) emitStoreDebounced(paths[p]);
            }).catch(function () {});
        });
    };

    Sync._subscribe = function () {
        var self = this;
        if (this._channel) return;
        var channel = this.client.channel('couple:' + this.coupleId);
        STORE_COLLECTIONS.forEach(function (t) {
            channel.on('postgres_changes', { event: '*', schema: 'public', table: t, filter: 'couple_id=eq.' + self.coupleId }, function (payload) {
                self._onChange(t, payload);
            });
        });
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'couple_members', filter: 'couple_id=eq.' + self.coupleId }, function (payload) {
            self._onChange('couple_members', payload);
        });
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'couples' }, function (payload) {
            self._onChange('couples', payload);
        });
        channel.on('presence', { event: 'sync' }, function () { self._onPresenceSync(channel); });
        channel.subscribe(function (status) {
            self._channelStatus = status;
            if (status === 'SUBSCRIBED') {
                if (self.memberId) {
                    try { channel.track({ profile: self.memberId }); } catch (e) {}
                }
                self._loadCoupleDoc();
                STORE_COLLECTIONS.forEach(function (s) { self._loadStore(s); });
            }
            self._refreshStatus();
        });
        this._channel = channel;
        /* Filtered subscriptions cannot receive DELETE events for these tables
           (their realtime publication uses the default replica identity, so the
           WAL only carries the primary key and couple_id cannot be matched).
           Listen for DELETE events without a filter and let the client decide
           whether the deleted id belongs to this couple. */
        var delChannel = this.client.channel('couple-deletes:' + this.coupleId);
        STORE_COLLECTIONS.forEach(function (t) {
            delChannel.on('postgres_changes', { event: 'DELETE', schema: 'public', table: t }, function (payload) {
                var delId = payload.old && payload.old.id;
                if (!delId) return;
                self._onChange(t, { eventType: 'DELETE', old: { id: delId } });
            });
        });
        delChannel.subscribe(function () {});
        this._delChannel = delChannel;
    };

    Sync._onChange = function (store, payload) {
        var self = this;
        if (store === 'couples') {
            var row = payload.new || payload.old;
            if (!row || String(row.id) !== String(this.coupleId)) return;
            if (payload.eventType === 'DELETE') this._coupleRow = null;
            else this._coupleRow = payload.new;
            emitCoupleDebounced();
            return;
        }
        if (store === 'couple_members') {
            var row2 = payload.new || payload.old;
            if (!row2 || String(row2.couple_id) !== String(this.coupleId)) return;
            if (payload.eventType === 'DELETE') {
                this._membersRows = (this._membersRows || []).filter(function (m) { return String(m.id) !== String(row2.id); });
            } else {
                var exists = (this._membersRows || []).some(function (m) { return String(m.id) === String(row2.id); });
                if (exists) {
                    this._membersRows = this._membersRows.map(function (m) { return String(m.id) === String(row2.id) ? payload.new : m; });
                } else {
                    this._membersRows = (this._membersRows || []).concat([payload.new]);
                }
            }
            emitCoupleDebounced();
            return;
        }
        if (payload.eventType === 'DELETE') {
            var delId = payload.old && payload.old.id;
            if (delId) {
                var wasCached = !!(this._storeCache[store] && this._storeCache[store][String(delId)]);
                if (this._storeCache[store]) delete this._storeCache[store][String(delId)];
                if (wasCached && this.onRemoteDelete) this.onRemoteDelete(store, String(delId));
                if (wasCached && this.localDel) this.localDel(store, String(delId));
            }
        } else if (payload.new) {
            this._setRow(store, payload.new);
        }
        emitStoreDebounced(store);
    };

    Sync._onPresenceSync = function (channel) {
        var self = this;
        var state = channel.presenceState();
        var memberProfiles = {};
        (this._membersRows || []).forEach(function (m) {
            if (m.profile_id) memberProfiles[String(m.profile_id)] = true;
        });
        var othersOnline = false;
        Object.keys(state).forEach(function (k) {
            (state[k] || []).forEach(function (p) {
                if (p && p.profile && String(p.profile) !== String(self.memberId) && memberProfiles[String(p.profile)]) othersOnline = true;
            });
        });
        if (othersOnline !== this._partnerOnline) {
            this._partnerOnline = othersOnline;
            emitCoupleDebounced();
            if (this.onPresence) this.onPresence(othersOnline);
        }
    };

    /* =========================================================
       WRITES
       ========================================================= */
    Sync.push = function (store, rec) {
        if (!this.ready || !this.authed || !this.coupleId) return;
        if (STORE_COLLECTIONS.indexOf(store) < 0) return;
        var self = this;
        this.setPending(1);
        this._upsertRow(this.coupleId, store, rec, rec.storagePath || null).then(function () {
            self.setPending(-1);
        }).catch(function () {
            self.setPending(-1);
        });
    };

    Sync.pushDelete = function (store, id) {
        if (!this.ready || !this.authed || !this.coupleId) return;
        if (STORE_COLLECTIONS.indexOf(store) < 0) return;
        var self = this;
        this.setPending(1);
        this.client.from(store).delete().eq('id', id).eq('couple_id', this.coupleId).then(function (res) {
            if (res.error) throw res.error;
        }).catch(function () {
        }).then(function () {
            self.setPending(-1);
        });
    };

    Sync.pushCouple = function (c) {
        if (!this.ready || !this.authed || !this.coupleId) return;
        if (String(c.id) !== String(this.coupleId)) return;
        var self = this;
        this.setPending(1);
        var tasks = [];
        tasks.push(this.client.from('couples').update({
            start_date: c.startDate || null,
            favorite_place: c.favoritePlace || '',
            favorite_activity: c.favoriteActivity || '',
            note: c.note || ''
        }).eq('id', this.coupleId));
        tasks.push(this._pushMember(c, 1));
        tasks.push(this._pushMember(c, 2));
        Promise.all(tasks).then(function () {
            self.setPending(-1);
        }).catch(function () {
            self.setPending(-1);
        });
    };

    Sync._pushMember = function (c, no) {
        var m = no === 1 ? (c.person1 || {}) : (c.person2 || {});
        var avatar = m.photo || null;
        var self = this;
        var update = function (avatarPath) {
            var name = String(m.name || '').trim() || (no === 1 ? 'Person 1' : 'Partner');
            var upd = { name: name };
            if (avatarPath) upd.avatar_path = avatarPath;
            var row = findMember(no);
            if (row && row.id) {
                return self.client.from('couple_members').update(upd).eq('id', row.id).then(function (res) {
                    if (res.error) throw res.error;
                });
            }
            return Promise.resolve();
        };
        if (!avatar || avatar.indexOf('data:') !== 0) return update(null);
        var path = 'couples/' + this.coupleId + '/avatars/member' + no + '.jpg';
        if (cachedImage(path) === avatar) return update(path);
        return this._upload(path, avatar).then(function () {
            return update(path);
        }).catch(function () {
            return update(null);
        });
    };

    Sync._upsertRow = function (coupleId, store, rec, storagePath) {
        var self = this;
        var row = recToRow(store, rec, coupleId, storagePath);
        return this.client.from(store).upsert(row, { onConflict: 'id' }).then(function (res) {
            if (res.error) {
                dbg('WRITE FAILED', store, JSON.stringify(row), res.error.message);
                throw res.error;
            }
            dbg('SAVED', store, 'auth_user=' + (self.memberId || ''), 'couple_id=' + coupleId,
                'id=' + row.id, 'storage_path=' + row.storage_path, 'created_by=' + row.created_by, 'row=' + JSON.stringify(row));
            var local = Object.assign({}, rec);
            local.storagePath = storagePath || rec.storagePath || '';
            local._synced = true;
            if (self.localPut) return self.localPut(store, local);
            return Promise.resolve();
        });
    };

    Sync._uploadLocal = function (coupleId, collections) {
        var self = this;
        if (!this.ready || !this.authed) return Promise.resolve();
        var jobs = [];
        STORE_COLLECTIONS.forEach(function (store) {
            var arr = collections[store];
            if (!arr || !arr.length) return;
            arr.forEach(function (r) {
                if (!r || !r.id) return;
                jobs.push(self._ensureRow(coupleId, store, r));
            });
        });
        return Promise.all(jobs).catch(function () {});
    };

    Sync._ensureRow = function (coupleId, store, rec) {
        var self = this;
        var path = rec.storagePath || null;
        var doUpsert = function (sp) {
            return self._upsertRow(coupleId, store, rec, sp || null);
        };
        if (path) return doUpsert(path);
        var img = store === 'photos' ? (rec.data || null) : (store === 'milestones' ? null : (rec.photo || null));
        if (img && img.indexOf('data:') === 0) {
            var newPath = 'couples/' + coupleId + '/' + store + '/' + rec.id + '.jpg';
            return this._upload(newPath, img).then(function () {
                return doUpsert(newPath);
            }).catch(function () {
                return doUpsert(null);
            });
        }
        return doUpsert(null);
    };

    /* =========================================================
       STORAGE
       ========================================================= */
    Sync.hasStorage = function () {
        return true;
    };

    Sync.photoPath = function (coupleId, kind, id) {
        return 'couples/' + coupleId + '/' + kind + '/' + id + '.jpg';
    };

    Sync._upload = function (path, dataUrl) {
        var blob = dataUrlToBlob(dataUrl);
        if (!blob) return Promise.reject(new Error('invalid-image'));
        cacheImage(path, dataUrl);
        return this.client.storage.from(BUCKET).upload(path, blob, {
            contentType: blob.type || 'image/jpeg',
            upsert: true
        }).then(function (res) {
            if (res.error) throw res.error;
            return res;
        });
    };

    Sync.uploadData = function (path, dataUrl) {
        if (!this.ready || !this.authed || !this.coupleId) return Promise.reject(new Error('sync-unavailable'));
        var self = this;
        return this._upload(path, dataUrl).then(function () {
            return { photoUrl: '', storagePath: path };
        });
    };

    Sync.removeFile = function (path) {
        if (!path || !this.ready || !this.authed) return Promise.resolve();
        return this.client.storage.from(BUCKET).remove([path]).catch(function () {});
    };

    window.Sync = Sync;
})();
