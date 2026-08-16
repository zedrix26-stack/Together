/* =============================================================
   TOGETHER - Couple Memory App
   Persistent storage (IndexedDB + localStorage fallback), CRUD
   and full Android-first UI logic.
   ============================================================= */

(function () {
    'use strict';

    /* =========================================================
       ICONS (SVG, consistent stroke style)
       ========================================================= */
    var ICONS = {
        home: '<path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>',
        image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
        clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
        more: '<path d="M5 12h.01"/><path d="M12 12h.01"/><path d="M19 12h.01"/>',
        sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
        plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
        close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'chevron-down': '<path d="m6 9 6 6 6-6"/>',
        'chevron-left': '<path d="m15 18-6-6 6-6"/>',
        'chevron-right': '<path d="m9 18 6-6-6-6"/>',
        search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
        edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
        share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
        download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
        upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
        tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
        camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
        folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
        file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
        flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
        moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
        music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
        check: '<path d="M20 6 9 17l-5-5"/>',
        alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
        database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
        star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
        user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        sparkle: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
        'image-plus': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><path d="M19 11v4"/><path d="M17 13h4"/>',
        bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
        refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
        link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
        copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
        cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
        disc: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
        spotify: { fill: true, d: '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z"/>' },
        'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5Z"/>',
        send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        wifi: '<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
        plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>'
    };

    function ic(name, size) {
        var e = ICONS[name];
        if (!e) return '';
        var isFill = typeof e === 'object';
        var d = isFill ? e.d : e;
        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' +
            (isFill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor"') +
            ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
    }

    function mountIcons(root) {
        var els = (root || document).querySelectorAll('[data-icon]');
        Array.prototype.forEach.call(els, function (el) {
            var n = el.getAttribute('data-icon');
            var s = parseInt(el.getAttribute('data-size') || '18', 10);
            el.innerHTML = ic(n, s);
            el.style.width = s + 'px';
            el.style.height = s + 'px';
        });
    }

    /* =========================================================
       UTILITIES
       ========================================================= */
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function uid() {
        return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function parseISO(str) {
        if (!str) return null;
        var p = String(str).split('-').map(Number);
        if (p.length !== 3 || p.some(isNaN)) return null;
        return new Date(p[0], p[1] - 1, p[2]);
    }

    function toISO(d) {
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }

    function todayISO() { return toISO(new Date()); }
    function startOfToday() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }

    function fmtDate(iso, opts) {
        var d = parseISO(iso);
        if (!d) return '';
        try { return d.toLocaleDateString(undefined, opts || { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch (e) { return String(iso); }
    }

    function fmtDateLong(iso) { return fmtDate(iso, { year: 'numeric', month: 'long', day: 'numeric' }); }

    function debounce(fn, ms) {
        var t;
        return function () {
            var args = arguments, ctx = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(ctx, args); }, ms);
        };
    }

    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

    function initials(name) {
        return String(name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    function plural(n, word) { return n.toLocaleString() + ' ' + word + (n === 1 ? '' : 's'); }

    function downloadTextFile(text, filename, mime) {
        var blob = new Blob([text], { type: mime || 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
    }

    /* =========================================================
       TOAST
       ========================================================= */
    var toastTimer = null;
    function toast(msg, type) {
        var el = $('#toast');
        if (!el) return;
        el.textContent = msg;
        el.className = 'toast' + (type === 'success' ? ' success' : type === 'error' ? ' error' : '');
        el.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
    }

    /* =========================================================
       CONFIRM DIALOG (promise based)
       ========================================================= */
    function confirmDialog(opts) {
        return new Promise(function (resolve) {
            var dlg = $('#confirmDialog');
            if (!dlg) { resolve(false); return; }
            $('#confirmTitle').textContent = opts.title || 'Are you sure?';
            $('#confirmText').textContent = opts.text || '';
            $('#confirmIcon').innerHTML = ic(opts.icon || 'alert', 26);
            $('#confirmIcon').className = 'dialog-icon' + (opts.soft ? ' soft' : '');
            var ok = $('#confirmOk');
            ok.textContent = opts.confirmText || 'Confirm';
            ok.className = 'btn ' + (opts.confirmClass || 'btn-danger');
            var cancel = $('#confirmCancel');

            function done(v) {
                dlg.hidden = true;
                ok.removeEventListener('click', onOk);
                cancel.removeEventListener('click', onCancel);
                dlg.removeEventListener('click', onBackdrop);
                resolve(v);
            }
            function onOk() { done(true); }
            function onCancel() { done(false); }
            function onBackdrop(e) { if (e.target === dlg) done(false); }

            ok.addEventListener('click', onOk);
            cancel.addEventListener('click', onCancel);
            dlg.addEventListener('click', onBackdrop);
            dlg.hidden = false;
        });
    }

    /* =========================================================
       IMAGE HANDLING (read + compress)
       ========================================================= */
    function loadImageFile(file) {
        return new Promise(function (resolve, reject) {
            var r = new FileReader();
            r.onload = function () { resolve(r.result); };
            r.onerror = function () { reject(r.error); };
            r.readAsDataURL(file);
        });
    }

    function compressImage(dataUrl, maxDim, quality) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () {
                var w = img.width, h = img.height;
                var scale = Math.min(1, maxDim / Math.max(w, h));
                if (scale < 1) { w = Math.round(w * scale); h = Math.round(h * scale); }
                var canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                var out;
                try { out = canvas.toDataURL('image/jpeg', quality); } catch (e) { out = dataUrl; }
                if (out.length > dataUrl.length) out = dataUrl;
                resolve(out);
            };
            img.onerror = function () { resolve(dataUrl); };
            img.src = dataUrl;
        });
    }

    function processFile(file, maxDim, quality) {
        return loadImageFile(file).then(function (dataUrl) {
            return compressImage(dataUrl, maxDim || 1600, quality || 0.82);
        }).catch(function () {
            toast('Unable to read the image. Please try again.', 'error');
            return null;
        });
    }

    function pickFile(inputId, cb) {
        var input = $('#' + inputId);
        if (!input) return;
        var onChange = function () {
            var f = input.files && input.files[0];
            input.removeEventListener('change', onChange);
            input.value = '';
            if (f) cb(f);
        };
        input.addEventListener('change', onChange);
        input.click();
    }

    function showPhotoPreview(imgSel, emptySel, dataUrl) {
        var img = $(imgSel), empty = $(emptySel);
        if (img) { img.src = dataUrl; img.hidden = false; }
        if (empty) empty.hidden = true;
    }

    function hidePhotoPreview(imgSel, emptySel) {
        var img = $(imgSel), empty = $(emptySel);
        if (img) { img.src = ''; img.hidden = true; }
        if (empty) empty.hidden = false;
    }

    /* =========================================================
       STORAGE LAYER (IndexedDB primary, localStorage fallback)
       ========================================================= */
    var IDB_NAME = 'together-db';
    var IDB_VERSION = 3;
    var STORES = ['couples', 'photos', 'memories', 'moments', 'milestones', 'chat', 'files'];
    var EXPORT_STORES = STORES.filter(function (s) { return s !== 'files' && s !== 'chat'; });
    var LS_SETTINGS = 'together_settings';
    var LS_CURRENT = 'together_current';

    function lsKey(store) { return 'together_' + store; }
    function lsRead(store) {
        try { return JSON.parse(localStorage.getItem(lsKey(store)) || '[]'); }
        catch (e) { return []; }
    }
    function lsWrite(store, arr) {
        localStorage.setItem(lsKey(store), JSON.stringify(arr));
    }
    function lsGet(store, id) { return lsRead(store).find(function (x) { return String(x.id) === String(id); }) || null; }
    function lsPut(store, obj) {
        var arr = lsRead(store);
        var i = arr.findIndex(function (x) { return String(x.id) === String(obj.id); });
        if (i >= 0) arr[i] = obj; else arr.push(obj);
        lsWrite(store, arr);
    }
    function lsDel(store, id) { lsWrite(store, lsRead(store).filter(function (x) { return String(x.id) !== String(id); })); }

    var Storage = {
        mode: null,
        db: null,
        init: function () {
            var self = this;
            return new Promise(function (resolve) {
                if (typeof indexedDB === 'undefined') { self.mode = 'ls'; resolve(); return; }
                var req;
                try { req = indexedDB.open(IDB_NAME, IDB_VERSION); }
                catch (e) { self.mode = 'ls'; resolve(); return; }
                req.onupgradeneeded = function () {
                    var db = req.result;
                    STORES.forEach(function (s) {
                        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
                    });
                };
                req.onsuccess = function () {
                    self.db = req.result;
                    self.mode = 'idb';
                    resolve();
                };
                req.onerror = function () {
                    self.db = null;
                    self.mode = 'ls';
                    console.warn('IndexedDB unavailable, using localStorage fallback.');
                    resolve();
                };
                req.onblocked = function () {};
            });
        },
        getAll: function (store) {
            if (this.mode === 'idb') return this._idbAll(store);
            return Promise.resolve(lsRead(store));
        },
        get: function (store, id) {
            if (this.mode === 'idb') return this._idbGet(store, id);
            return Promise.resolve(lsGet(store, id));
        },
        put: function (store, obj) {
            if (this.mode === 'idb') return this._idbPut(store, obj);
            try { lsPut(store, obj); return Promise.resolve(); }
            catch (e) { return Promise.reject(e); }
        },
        del: function (store, id) {
            if (this.mode === 'idb') return this._idbDel(store, id);
            try { lsDel(store, id); return Promise.resolve(); }
            catch (e) { return Promise.reject(e); }
        },
        clear: function (store) {
            if (this.mode === 'idb') return this._idbClear(store);
            try { lsWrite(store, []); return Promise.resolve(); }
            catch (e) { return Promise.reject(e); }
        },
        replaceAll: function (store, arr) {
            if (this.mode === 'idb') return this._idbReplaceAll(store, arr);
            try { lsWrite(store, arr); return Promise.resolve(); }
            catch (e) { return Promise.reject(e); }
        },
        _idbAll: function (store) {
            var self = this;
            return new Promise(function (res, rej) {
                var t = self.db.transaction(store);
                var rq = t.objectStore(store).getAll();
                rq.onsuccess = function () { res(rq.result); };
                rq.onerror = function () { rej(rq.error); };
            });
        },
        _idbGet: function (store, id) {
            var self = this;
            return new Promise(function (res, rej) {
                var t = self.db.transaction(store);
                var rq = t.objectStore(store).get(id);
                rq.onsuccess = function () { res(rq.result || null); };
                rq.onerror = function () { rej(rq.error); };
            });
        },
        _idbPut: function (store, obj) {
            var self = this;
            return new Promise(function (res, rej) {
                var t = self.db.transaction(store, 'readwrite');
                var rq = t.objectStore(store).put(obj);
                rq.onsuccess = function () { res(); };
                rq.onerror = function () { rej(rq.error); };
            });
        },
        _idbDel: function (store, id) {
            var self = this;
            return new Promise(function (res, rej) {
                var t = self.db.transaction(store, 'readwrite');
                var rq = t.objectStore(store).delete(id);
                rq.onsuccess = function () { res(); };
                rq.onerror = function () { rej(rq.error); };
            });
        },
        _idbClear: function (store) {
            var self = this;
            return new Promise(function (res, rej) {
                var t = self.db.transaction(store, 'readwrite');
                var rq = t.objectStore(store).clear();
                rq.onsuccess = function () { res(); };
                rq.onerror = function () { rej(rq.error); };
            });
        },
        _idbReplaceAll: function (store, arr) {
            var self = this;
            return new Promise(function (res, rej) {
                var t = self.db.transaction(store, 'readwrite');
                var os = t.objectStore(store);
                os.clear();
                arr.forEach(function (o) { os.put(o); });
                t.oncomplete = function () { res(); };
                t.onerror = function () { rej(t.error); };
            });
        }
    };

    /* =========================================================
       APP STATE
       ========================================================= */
    var state = {
        couples: [],          // all couple/profile docs
        couple: null,         // active couple doc
        currentProfileId: null,
        photos: [],           // in-memory lists for the active couple
        memories: [],
        moments: [],
        milestones: [],
        chats: [],            // chat messages for the active scope
        chatIds: {},          // id dedupe map for chat
        chatStatus: 'idle',   // online/offline for the chat connection
        settings: null,
        syncCouple: false,
        coupleCode: null,
        syncStatus: 'idle',
        partnerJoined: false,
        partnerName: '',
        partnerOnline: false
    };

    function defaultSettings() {
        return {
            theme: 'system',
            music: false,
            musicSource: 'ambient',
            musicMood: 'romantic',
            musicUrl: '',
            musicFileId: null,
            musicFileName: '',
            musicVolume: 0.7,
            spotifyUrl: ''
        };
    }

    state.settings = defaultSettings();

    /* =========================================================
       STORE (data access layer)
       ========================================================= */
    var Store = {
        saveCouple: function (c) {
            if (c && window.Sync && Sync.coupleId && String(Sync.coupleId) === String(c.id)) {
                Sync.pushCouple(c);
            }
            return Storage.put('couples', c);
        },
        getCouple: function (id) { return Storage.get('couples', id); },
        listCouples: function () {
            return Storage.getAll('couples').then(function (all) {
                return all.slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
            });
        },
        deleteCouple: function (id) {
            if (id && window.Sync && String(Sync.coupleId) === String(id)) {
                Sync.deleteCouple(id);
                if (Sync.onCouple) Sync.detach();
            }
            var jobs = STORES.filter(function (s) { return s !== 'couples'; }).map(function (s) {
                return Storage.getAll(s).then(function (items) {
                    return Storage.replaceAll(s, items.filter(function (x) { return String(x.profileId) !== String(id); }));
                });
            });
            jobs.push(Storage.del('couples', id));
            return Promise.all(jobs);
        },
        savePhoto: function (p) { if (window.Sync) Sync.push('photos', p); return Storage.put('photos', p); },
        listPhotos: function (pid) {
            return Storage.getAll('photos').then(function (all) {
                return all.filter(function (p) { return String(p.profileId) === String(pid); })
                    .sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0); });
            });
        },
        deletePhoto: function (id) {
            addTombstone(state.currentProfileId, 'photos', id);
            if (window.Sync) Sync.pushDelete('photos', id);
            return Storage.del('photos', id);
        },
        saveMemory: function (m) { if (window.Sync) Sync.push('memories', m); return Storage.put('memories', m); },
        listMemories: function (pid) {
            return Storage.getAll('memories').then(function (all) {
                return all.filter(function (m) { return String(m.profileId) === String(pid); })
                    .sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0); });
            });
        },
        deleteMemory: function (id) {
            addTombstone(state.currentProfileId, 'memories', id);
            if (window.Sync) Sync.pushDelete('memories', id);
            return Storage.del('memories', id);
        },
        saveMoment: function (m) { if (window.Sync) Sync.push('moments', m); return Storage.put('moments', m); },
        listMoments: function (pid) {
            return Storage.getAll('moments').then(function (all) {
                return all.filter(function (m) { return String(m.profileId) === String(pid); })
                    .sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0); });
            });
        },
        deleteMoment: function (id) {
            addTombstone(state.currentProfileId, 'moments', id);
            if (window.Sync) Sync.pushDelete('moments', id);
            return Storage.del('moments', id);
        },
        saveMilestone: function (m) { if (window.Sync) Sync.push('milestones', m); return Storage.put('milestones', m); },
        listMilestones: function (pid) {
            return Storage.getAll('milestones').then(function (all) {
                return all.filter(function (m) { return String(m.profileId) === String(pid); })
                    .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
            });
        },
        deleteMilestone: function (id) {
            addTombstone(state.currentProfileId, 'milestones', id);
            if (window.Sync) Sync.pushDelete('milestones', id);
            return Storage.del('milestones', id);
        },
        listChats: function (pid) {
            return Storage.getAll('chat').then(function (all) {
                return all.filter(function (c) { return String(c.profileId) === String(pid); })
                    .sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
            });
        },
        saveChat: function (m) {
            return Storage.put('chat', m).then(function () {
                if (!state.chatIds[m.id]) state.chatIds[m.id] = 1;
                return m;
            });
        },
        hasChat: function (id) { return !!state.chatIds[id]; },

        loadSettings: function () {
            try {
                var s = JSON.parse(localStorage.getItem(LS_SETTINGS) || '{}');
                if (s && typeof s === 'object') return Object.assign(defaultSettings(), s);
            } catch (e) {}
            return defaultSettings();
        },
        saveSettings: function (s) {
            try { localStorage.setItem(LS_SETTINGS, JSON.stringify(s)); }
            catch (e) {}
        },
        loadCurrentId: function () { return localStorage.getItem(LS_CURRENT) || null; },
        saveCurrentId: function (id) {
            try {
                if (id == null) localStorage.removeItem(LS_CURRENT);
                else localStorage.setItem(LS_CURRENT, id);
            } catch (e) {}
        },
        exportAll: function () {
            return Promise.all(EXPORT_STORES.map(function (s) { return Storage.getAll(s); })).then(function (res) {
                return {
                    app: 'together',
                    version: 1,
                    exportedAt: new Date().toISOString(),
                    couples: res[0],
                    photos: res[1],
                    memories: res[2],
                    moments: res[3],
                    milestones: res[4],
                    settings: state.settings
                };
            });
        },
        importAll: function (data) {
            if (!data || data.app !== 'together') return Promise.reject(new Error('invalid backup'));
            var jobs = EXPORT_STORES.map(function (s) {
                return Storage.replaceAll(s, Array.isArray(data[s]) ? data[s] : []);
            });
            return Promise.all(jobs).then(function () {
                if (data.settings && typeof data.settings === 'object') {
                    state.settings = Object.assign(defaultSettings(), data.settings);
                    Store.saveSettings(state.settings);
                }
            });
        },
        clearAll: function () {
            return Promise.all(STORES.map(function (s) { return Storage.clear(s); })).then(function () {
                try {
                    localStorage.removeItem(LS_SETTINGS);
                    localStorage.removeItem(LS_CURRENT);
                } catch (e) {}
            });
        }
    };

    /* =========================================================
       LEGACY MIGRATION (old localStorage format)
       ========================================================= */
    function migrateLegacy() {
        return new Promise(function (resolve) {
            try {
                var mk = 'loveAppCurrentProfile';
                if (!localStorage.getItem(mk)) { resolve(false); return; }
                Store.listCouples().then(function (couples) {
                    if (couples.length) {
                        try { localStorage.removeItem(mk); localStorage.removeItem('loveAppProfiles'); } catch (e) {}
                        resolve(false);
                        return;
                    }
                    var cur = JSON.parse(localStorage.getItem(mk) || 'null');
                    var profs = JSON.parse(localStorage.getItem('loveAppProfiles') || '[]');
                    var list = [];
                    if (cur && (cur.person1 || cur.person2)) list.push(cur);
                    profs.forEach(function (p) {
                        if (p && (p.person1 || p.person2) && !list.some(function (x) { return String(x.id) === String(p.id); })) list.push(p);
                    });
                    var jobs = [];
                    list.forEach(function (p) {
                        var pid = String(p.id || uid());
                        var couple = {
                            id: pid,
                            person1: { name: p.person1 || 'Person 1', photo: null },
                            person2: { name: p.person2 || 'Person 2', photo: null },
                            startDate: p.loveDate || '',
                            favoritePlace: '', favoriteActivity: '', note: '',
                            createdAt: Date.now()
                        };
                        jobs.push(Storage.put('couples', couple));
                        (p.photos || []).forEach(function (ph) {
                            if (!ph || !ph.data) return;
                            jobs.push(Storage.put('photos', {
                                id: String(ph.id || uid()),
                                profileId: pid,
                                data: ph.data,
                                caption: '',
                                date: String((ph.date || new Date().toISOString())).slice(0, 10),
                                createdAt: Date.now()
                            }));
                        });
                        (p.timeline || []).forEach(function (m) {
                            if (!m || !m.title) return;
                            jobs.push(Storage.put('memories', {
                                id: String(m.id || uid()),
                                profileId: pid,
                                title: m.title,
                                date: m.date || '',
                                description: m.description || '',
                                photo: m.image || null,
                                createdAt: Date.now()
                            }));
                        });
                    });
                    Promise.all(jobs).then(function () {
                        if (cur) Store.saveCurrentId(String(cur.id || uid()));
                        try { localStorage.removeItem(mk); localStorage.removeItem('loveAppProfiles'); } catch (e) {}
                        resolve(true);
                    });
                });
            } catch (e) { resolve(false); }
        });
    }

    /* =========================================================
       CALCULATIONS
       ========================================================= */
    var AUTO_MILESTONES = [
        { days: 30, label: '1 month together' },
        { days: 60, label: '2 months together' },
        { days: 100, label: '100 days together' },
        { days: 182, label: '6 months together' },
        { days: 365, label: '1 year together' },
        { days: 730, label: '2 years together' },
        { days: 1000, label: '1000 days together' },
        { days: 1095, label: '3 years together' },
        { days: 1825, label: '5 years together' },
        { days: 3650, label: '10 years together' }
    ];

    function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
    function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }

    function computeDuration(startISO) {
        var start = parseISO(startISO);
        var today = startOfToday();
        if (!start || start > today) return { years: 0, months: 0, days: 0, totalDays: 0 };
        var y = today.getFullYear() - start.getFullYear();
        var m = today.getMonth() - start.getMonth();
        var d = today.getDate() - start.getDate();
        if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        return { years: y, months: m, days: d, totalDays: daysBetween(start, today) };
    }

    function upcomingMilestones(startISO, customMilestones) {
        var start = parseISO(startISO);
        var today = startOfToday();
        var list = [];
        if (start) {
            AUTO_MILESTONES.forEach(function (ms) {
                var date = addDays(start, ms.days);
                list.push({ title: ms.label, date: date, iso: toISO(date), remaining: daysBetween(today, date), days: ms.days, type: 'auto' });
            });
        }
        (customMilestones || []).forEach(function (ms) {
            var date = parseISO(ms.date);
            if (!date) return;
            list.push({ title: ms.title, date: date, iso: toISO(date), remaining: daysBetween(today, date), type: 'custom', id: ms.id });
        });
        var next = list.filter(function (x) { return x.remaining >= 0; }).sort(function (a, b) { return a.remaining - b.remaining; })[0] || null;

        var anniversary = null;
        if (start) {
            var ann = new Date(today.getFullYear(), start.getMonth(), start.getDate());
            var rem = daysBetween(today, ann);
            if (rem < 0) { ann.setFullYear(today.getFullYear() + 1); rem = daysBetween(today, ann); }
            anniversary = { title: 'Anniversary', remaining: rem, date: ann, iso: toISO(ann) };
        }
        return { list: list, next: next, anniversary: anniversary };
    }

    /* =========================================================
       RENDERING
       ========================================================= */
    function avatarHTML(photo, text, cls) {
        return '<span class="avatar ' + (cls || 'avatar-xl') + '">' + (photo ? '<img src="' + photo + '" alt="">' : esc(text || '?')) + '</span>';
    }

    function coupleInitials(c) {
        var a = (c && c.person1 && c.person1.name || '')[0] || '';
        var b = (c && c.person2 && c.person2.name || '')[0] || '';
        return (a + b).toUpperCase() || '?';
    }

    function emptyHTML(iconName, title, text, btnLabel, action) {
        return '<div class="empty">' +
            '<span class="ic">' + ic(iconName, 44) + '</span>' +
            '<div class="empty-title">' + esc(title) + '</div>' +
            '<div class="empty-text">' + esc(text) + '</div>' +
            (btnLabel ? '<button class="btn btn-primary" data-empty-action="' + action + '">' + btnLabel + '</button>' : '') +
            '</div>';
    }

    function updateAppBar() {
        var c = state.couple;
        var avatar = $('#appBarAvatar');
        var name = $('#appBarName');
        if (c && c.person1 && c.person1.name) {
            name.textContent = (c.person1.name || '') + ' & ' + (c.person2 && c.person2.name || '');
            avatar.innerHTML = (c.person1.photo ? '<img src="' + c.person1.photo + '" alt="">' : esc(coupleInitials(c)));
        } else {
            name.textContent = 'Profile';
            avatar.textContent = 'P';
        }
    }

    function renderHome() {
        var el = $('#tab-home');
        if (!el) return;
        var c = state.couple;
        if (!c || !c.person1 || !c.person1.name || !c.person2 || !c.person2.name) {
            el.innerHTML = '<div class="empty" style="padding-top:80px">' +
                '<span class="ic">' + ic('user', 44) + '</span>' +
                '<div class="empty-title">Welcome</div>' +
                '<div class="empty-text">Set up your couple profile to get started.</div>' +
                '<button class="btn btn-primary" id="homeSetupBtn">Set up profile</button></div>';
            var b = $('#homeSetupBtn');
            if (b) b.addEventListener('click', openEditProfile);
            return;
        }

        var n1 = c.person1.name || 'Person 1';
        var n2 = c.person2.name || 'Person 2';
        var dur = computeDuration(c.startDate);
        var up = upcomingMilestones(c.startDate, state.milestones);
        var recent = recentItems(6);

        var hero = '<div class="home-hero">' +
            '<div class="home-avatars">' + avatarHTML(c.person1.photo, initials(n1)) + avatarHTML(c.person2.photo, initials(n2)) + '</div>' +
            '<div class="home-hero-text">' +
            '<h2 class="home-hero-name">' + esc(n1) + ' &amp; ' + esc(n2) + '</h2>' +
            '<p class="home-hero-sub">' + (c.startDate ? 'Together since ' + fmtDateLong(c.startDate) : 'Set your start date') + '</p>' +
            '</div>' +
            '<button class="icon-btn" data-home="edit" aria-label="Edit profile">' + ic('edit', 20) + '</button>' +
            '</div>';

        var duration = '<div class="card">' +
            '<div class="card-title">Together for</div>' +
            '<div class="duration-value">' + dur.years + ' years, ' + dur.months + ' months, ' + dur.days + ' days</div>' +
            '<div class="duration-sub">' + dur.totalDays.toLocaleString() + ' days together</div>' +
            '<div class="stat-row">' +
            '<div class="stat-box"><div class="stat-num">' + dur.totalDays.toLocaleString() + '</div><div class="stat-box-label">Total days</div></div>' +
            '<div class="stat-box"><div class="stat-num">' + (dur.years * 12 + dur.months).toLocaleString() + '</div><div class="stat-box-label">Months</div></div>' +
            '<div class="stat-box"><div class="stat-num">' + dur.years.toLocaleString() + '</div><div class="stat-box-label">Years</div></div>' +
            '</div></div>';

        var upcomingRows = '';
        if (up.anniversary) {
            upcomingRows += '<div class="upcoming-row">' +
                '<div class="upcoming-main"><div class="upcoming-title">' + (up.anniversary.remaining === 0 ? 'Today is your anniversary' : 'Anniversary') + '</div>' +
                '<div class="upcoming-sub">' + fmtDateLong(up.anniversary.iso) + '</div></div>' +
                '<div class="upcoming-badge">' + (up.anniversary.remaining === 0 ? 'Today' : plural(up.anniversary.remaining, 'day')) + '</div></div>';
        }
        if (up.next) {
            var targetDays = up.next.type === 'auto' ? up.next.days : (dur.totalDays + up.next.remaining);
            var pct = targetDays > 0 ? Math.min(100, Math.round(dur.totalDays / targetDays * 100)) : 0;
            upcomingRows += '<div class="upcoming-row">' +
                '<div class="upcoming-main"><div class="upcoming-title">' + esc(up.next.title) + '</div>' +
                '<div class="upcoming-sub">' + fmtDateLong(up.next.iso) + '</div></div>' +
                '<div class="upcoming-badge">' + (up.next.remaining === 0 ? 'Today' : plural(up.next.remaining, 'day')) + '</div></div>' +
                '<div class="progress"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
        }
        if (!upcomingRows) {
            upcomingRows = '<div class="upcoming-row"><div class="upcoming-main"><div class="upcoming-title">Nothing upcoming</div><div class="upcoming-sub">Add a milestone to see it here.</div></div></div>';
        }
        var upcoming = '<div class="card"><div class="card-title">Upcoming</div>' + upcomingRows + '</div>';

        var recentHTML;
        if (recent.length) {
            recentHTML = '<div class="card"><div class="card-title">Recent memories</div><div class="recent-strip">' +
                recent.map(function (r) {
                    var src = r.kind === 'photo' ? r.item.data : r.item.photo;
                    var alt = r.item.caption || r.item.title || 'Memory';
                    return '<button class="recent-thumb" data-recent data-kind="' + r.kind + '" data-id="' + esc(r.item.id) + '" aria-label="Open ' + esc(alt) + '"><img src="' + src + '" alt="' + esc(alt) + '" loading="lazy"></button>';
                }).join('') +
                '</div></div>';
        } else {
            recentHTML = '<div class="card"><div class="card-title">Recent memories</div>' +
                '<div class="empty" style="padding:12px 0 4px"><div class="empty-text">Nothing yet — add your first photo or memory.</div></div></div>';
        }

        var quick = '<div class="card"><div class="card-title">Quick actions</div><div class="quick-actions">' +
            '<button class="quick-btn" data-action="addPhoto"><span class="ic">' + ic('image-plus', 22) + '</span>Add Photo</button>' +
            '<button class="quick-btn" data-action="addMemory"><span class="ic">' + ic('bookmark', 22) + '</span>Add Memory</button>' +
            '<button class="quick-btn" data-action="addMoment"><span class="ic">' + ic('sparkle', 22) + '</span>Add Moment</button>' +
            '</div></div>';

        el.innerHTML = hero + duration + upcoming + recentHTML + quick;
    }

    function recentItems(n) {
        var items = [];
        state.photos.forEach(function (p) { items.push({ kind: 'photo', item: p, sort: p.date || '', ts: p.createdAt || 0 }); });
        state.memories.forEach(function (m) { if (m.photo) items.push({ kind: 'memory', item: m, sort: m.date || '', ts: m.createdAt || 0 }); });
        items.sort(function (a, b) { return (b.sort || '').localeCompare(a.sort || '') || (b.ts - a.ts); });
        return items.slice(0, n);
    }

    function renderPhotos() {
        var grid = $('#photoGrid');
        if (!grid) return;
        var q = ($('#photoSearch').value || '').toLowerCase().trim();
        var items = state.photos;
        if (q) items = items.filter(function (p) { return ((p.caption || '') + ' ' + (p.date || '')).toLowerCase().indexOf(q) >= 0; });

        if (!items.length) {
            grid.innerHTML = emptyHTML('image', 'No memories yet', q ? 'No photos match your search.' : 'Add your first photo to start your collection.', q ? null : 'Add Photo', 'addPhoto');
            return;
        }
        grid.innerHTML = items.map(function (p) {
            return '<div class="photo-tile" data-id="' + esc(p.id) + '" role="button" tabindex="0" aria-label="Open photo">' +
                '<img src="' + (p.data || p.photoUrl || '') + '" alt="' + esc(p.caption || 'Photo') + '" loading="lazy">' +
                (p.caption ? '<span class="photo-tile-caption">' + esc(p.caption) + '</span>' : '') +
                '<button class="photo-tile-delete" data-del="' + esc(p.id) + '" aria-label="Delete photo">' + ic('trash', 14) + '</button>' +
                '</div>';
        }).join('');
    }

    function renderTimeline() {
        var list = $('#timelineList');
        if (!list) return;
        var q = ($('#memorySearch').value || '').toLowerCase().trim();
        var items = state.memories;
        if (q) items = items.filter(function (m) { return ((m.title || '') + ' ' + (m.description || '') + ' ' + (m.date || '')).toLowerCase().indexOf(q) >= 0; });

        if (!items.length) {
            list.innerHTML = emptyHTML('clock', 'No memories yet', q ? 'No memories match your search.' : 'Record a moment you want to remember.', q ? null : 'Add Memory', 'addMemory');
            return;
        }
        list.innerHTML = items.map(function (m) {
            return '<article class="timeline-item" data-mid="' + esc(m.id) + '">' +
                '<div class="timeline-dot" aria-hidden="true"></div>' +
                '<div class="timeline-card">' +
                '<div class="timeline-date">' + (m.date ? fmtDateLong(m.date) : 'No date') + '</div>' +
                '<h3 class="timeline-title">' + esc(m.title) + '</h3>' +
                (m.description ? '<p class="timeline-desc">' + esc(m.description) + '</p>' : '') +
                (m.photo || m.photoUrl ? '<img class="timeline-img" src="' + (m.photo || m.photoUrl || '') + '" alt="' + esc(m.title) + '" loading="lazy">' : '') +
                '<div class="timeline-actions">' +
                '<button class="icon-btn" data-act="edit" aria-label="Edit memory">' + ic('edit', 18) + '</button>' +
                '<button class="icon-btn" data-act="del" aria-label="Delete memory">' + ic('trash', 18) + '</button>' +
                '</div></div></article>';
        }).join('');
    }

    var CATEGORIES = ['Date', 'Trip', 'Food', 'Celebration', 'Milestone', 'Other'];
    var momentFilter = 'All';

    function renderMoments() {
        var list = $('#momentList');
        var chips = $('#momentChips');
        if (!list || !chips) return;
        var q = ($('#momentSearch').value || '').toLowerCase().trim();
        chips.innerHTML = ['All'].concat(CATEGORIES).map(function (c) {
            return '<button class="chip' + (c === momentFilter ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
        }).join('');
        var items = state.moments;
        if (momentFilter !== 'All') items = items.filter(function (m) { return m.category === momentFilter; });
        if (q) items = items.filter(function (m) { return ((m.title || '') + ' ' + (m.description || '') + ' ' + (m.category || '')).toLowerCase().indexOf(q) >= 0; });

        if (!items.length) {
            list.innerHTML = emptyHTML('calendar', 'No moments yet', (q || momentFilter !== 'All') ? 'Nothing matches your filters.' : 'Save the moments that matter.', (q || momentFilter !== 'All') ? null : 'Add Moment', 'addMoment');
            return;
        }
        list.innerHTML = '<div class="moment-grid">' + items.map(function (m) {
            return '<article class="moment-card" data-mid="' + esc(m.id) + '">' +
                (m.photo || m.photoUrl ? '<img class="moment-img" src="' + (m.photo || m.photoUrl || '') + '" alt="' + esc(m.title) + '" loading="lazy">' : '') +
                '<div class="moment-body">' +
                '<div class="moment-top">' +
                '<h3 class="moment-title">' + esc(m.title) + '</h3>' +
                '<div class="moment-actions">' +
                '<button class="icon-btn" data-act="edit" aria-label="Edit moment">' + ic('edit', 18) + '</button>' +
                '<button class="icon-btn" data-act="del" aria-label="Delete moment">' + ic('trash', 18) + '</button>' +
                '</div></div>' +
                '<p class="moment-date">' + (m.date ? fmtDateLong(m.date) : 'No date') + (m.category ? ' · ' + esc(m.category) : '') + '</p>' +
                (m.description ? '<p class="moment-desc">' + esc(m.description) + '</p>' : '') +
                '</div></article>';
        }).join('') + '</div>';
    }

    /* =========================================================
       CHAT
       Couple messaging, text + photos.
       Every message is mirrored through the couple's Supabase
       sync, so chat works over any internet connection (mobile
       data or Wi-Fi). Photo bytes upload to the couple-media
       bucket, and a signed URL reaches the partner.
       ========================================================= */
    var chatPendingPhoto = null;

    function chatDeviceId() {
        try {
            var k = 'together_chat_device';
            var v = localStorage.getItem(k);
            if (!v) {
                v = 'd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
                localStorage.setItem(k, v);
            }
            return v;
        } catch (e) {
            return 'd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
        }
    }

    function chatSenderId() {
        if (window.Sync && Sync.memberId) return String(Sync.memberId);
        return chatDeviceId();
    }

    function chatSenderName() {
        var c = state.couple;
        return (c && c.person1 && c.person1.name) || 'Me';
    }

    function chatCloudActive() {
        return !!(window.Sync && Sync.ready && Sync.authed && Sync.coupleId &&
            state.couple && String(state.couple.id) === String(Sync.coupleId));
    }

    function chatStatusLabel(s) {
        if (chatCloudActive()) return 'Online';
        if (state.syncCouple) return 'Offline \u2014 messages will sync later';
        return 'Not connected';
    }

    function chatStatusAttr() {
        return chatCloudActive() ? 'online' : 'offline';
    }

    function chatSetStatus(s) {
        state.chatStatus = s;
        var chip = $('#chatStatus');
        if (!chip) return;
        chip.dataset.status = chatStatusAttr();
        chip.textContent = chatStatusLabel(s);
    }

    function chatSort(list) {
        list.sort(function (a, b) {
            var d = (a.createdAt || 0) - (b.createdAt || 0);
            if (d !== 0) return d;
            return String(a.id || '').localeCompare(String(b.id || ''));
        });
    }

    function chatScrollToBottom() {
        if (currentTab !== 'chat') return;
        var el = $('#content');
        if (!el) return;
        requestAnimationFrame(function () {
            el.scrollTop = el.scrollHeight;
        });
    }

    function chatPersist(m) {
        return Store.saveChat(m).then(function () {
            var exists = state.chats.some(function (x) { return String(x.id) === String(m.id); });
            if (!exists) {
                state.chats.push(m);
                chatSort(state.chats);
            }
            renderChat();
            chatScrollToBottom();
        });
    }

    function chatBuildMessage(text, photo) {
        return {
            id: uid(),
            profileId: String(state.currentProfileId || ''),
            sender: chatSenderId(),
            senderName: chatSenderName(),
            text: text || '',
            kind: photo ? 'image' : 'text',
            photo: photo || null,
            photoUrl: '',
            storagePath: '',
            createdAt: Date.now()
        };
    }

    function chatSend() {
        var input = $('#chatInput');
        if (!input) return;
        var text = (input.value || '').trim();
        var photo = chatPendingPhoto;
        if (!text && !photo) { toast('Type a message or attach a photo.', 'error'); return; }
        chatPendingPhoto = null;
        updateChatAttachUI();
        var m = chatBuildMessage(text, photo);
        if (photo && photo.indexOf('data:') === 0 && chatCloudActive()) {
            chatSetSending(true);
            uploadPhotoBase64(photo, 'chat', m.id).then(function (r) {
                m.photoUrl = r.photoUrl || '';
                m.storagePath = r.storagePath || '';
                return chatPersist(m).then(function () {
                    if (window.Sync) Sync.push('chat', m);
                });
            }).catch(function () {
                return chatPersist(m);
            }).then(function () {
                chatSetSending(false);
            });
        } else {
            chatPersist(m).then(function () {
                if (chatCloudActive() && window.Sync) Sync.push('chat', m);
            });
        }
        input.value = '';
    }

    function chatSetSending(busy) {
        var b = $('#chatSend');
        if (!b) return;
        b.disabled = busy;
        b.textContent = busy ? 'Sending\u2026' : 'Send';
    }

    function updateChatAttachUI() {
        var wrap = $('#chatAttachPreview');
        var img = $('#chatAttachPreviewImg');
        var btn = $('#chatAttach');
        if (chatPendingPhoto) {
            if (img) img.src = chatPendingPhoto;
            if (wrap) wrap.hidden = false;
            if (btn) btn.classList.add('has-photo');
        } else {
            if (img) img.removeAttribute('src');
            if (wrap) wrap.hidden = true;
            if (btn) btn.classList.remove('has-photo');
        }
    }

    function chatPickPhoto() {
        pickFile('file-chat', function (f) {
            processFile(f, 1200, 0.8).then(function (d) {
                if (!d) return;
                chatPendingPhoto = d;
                updateChatAttachUI();
            });
        });
    }

    function chatBubbleHTML(m) {
        var mine = String(m.sender) === chatSenderId();
        var img = (m.photo && m.photo.indexOf('data:') === 0) ? m.photo : (m.photoUrl || '');
        var body = '';
        if (img) body += '<img class="chat-img" src="' + esc(img) + '" alt="Photo" loading="lazy">';
        if (m.text) body += esc(m.text);
        var time = '';
        try {
            time = new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } catch (e) {}
        return '<div class="chat-row' + (mine ? ' mine' : '') + '" data-cid="' + esc(m.id) + '">' +
            '<div class="chat-bubble">' + body + '</div>' +
            '<div class="chat-meta">' + esc(time) + '</div></div>';
    }

    function renderChat() {
        var el = $('#tab-chat');
        if (!el) return;
        var list = $('#chatList');
        if (!list) return;

        chatSetStatus(state.chatStatus || 'online');

        if (!state.couple) { list.innerHTML = ''; return; }

        var msgs = (state.chats || []).slice();
        chatSort(msgs);
        if (!msgs.length) {
            list.innerHTML = '<div class="chat-empty"><span class="ic">' + ic('message-circle', 40) + '</span>' +
                '<div class="chat-empty-title">No messages yet</div>' +
                '<div class="chat-empty-text">Say hello to your partner. Messages are shared securely through your couple.</div></div>';
            return;
        }
        var html = [];
        var lastDay = null;
        msgs.forEach(function (m) {
            var day = '';
            try { day = new Date(m.createdAt || 0).toLocaleDateString([], { month: 'short', day: 'numeric' }); }
            catch (e) {}
            if (day && day !== lastDay) {
                html.push('<div class="chat-day">' + esc(day) + '</div>');
                lastDay = day;
            }
            html.push(chatBubbleHTML(m));
        });
        list.innerHTML = html.join('');
    }

    function renderMore() {
        var el = $('#tab-more');
        if (!el) return;
        var c = state.couple;
        var musicOn = !!state.settings.music;
        var tSel = state.settings.theme || 'system';
        var mSrc = state.settings.musicSource || 'ambient';
        var mMood = state.settings.musicMood || 'romantic';
        var mUrl = state.settings.musicUrl || '';
        var mFile = state.settings.musicFileName || '';
        var mVol = Math.round((state.settings.musicVolume != null ? state.settings.musicVolume : 0.7) * 100);
        var spotUrl = state.settings.spotifyUrl || '';
        var hasSpot = !!spotUrl;

        var musicHTML =
            '<div class="group"><h4 class="group-title">Music</h4><div class="list">' +
            '<div class="list-item"><span class="ic">' + ic('music', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Background music</div>' +
            '<div class="list-item-sub" id="musicStatus">' + esc(musicStatusText()) + '</div></div>' +
            '<label class="switch"><input type="checkbox" id="setMusic"' + (musicOn ? ' checked' : '') + '><span class="switch-track"></span></label></div>' +
            '<div class="music-panel" id="musicPanel"' + (musicOn ? '' : ' hidden') + '>' +
            '<div class="music-row"><div class="music-label">Source</div>' +
            '<div class="segmented" id="musicSourceSeg">' +
            '<button data-msrc="ambient" class="' + (mSrc === 'ambient' ? 'active' : '') + '">Ambient</button>' +
            '<button data-msrc="url" class="' + (mSrc === 'url' ? 'active' : '') + '">Link</button>' +
            '<button data-msrc="file" class="' + (mSrc === 'file' ? 'active' : '') + '">File</button>' +
            '</div></div>' +
            '<div class="music-row" id="musicMoodRow"' + (mSrc === 'ambient' ? '' : ' hidden') + '><div class="music-label">Mood</div>' +
            '<div class="segmented" id="musicMoodSeg">' +
            '<button data-mmood="romantic" class="' + (mMood === 'romantic' ? 'active' : '') + '">Romantic</button>' +
            '<button data-mmood="chill" class="' + (mMood === 'chill' ? 'active' : '') + '">Chill</button>' +
            '</div></div>' +
            '<div class="music-row" id="musicUrlRow"' + (mSrc === 'url' ? '' : ' hidden') + '>' +
            '<label class="music-label" for="musicUrlInput">Audio link (MP3, M4A, OGG)</label>' +
            '<div class="music-inline"><input type="url" id="musicUrlInput" class="input" placeholder="https://.../song.mp3" value="' + esc(mUrl) + '">' +
            '<button class="btn btn-primary btn-sm" id="musicUrlSave" type="button">Save</button></div>' +
            '<div class="music-note">Paste a direct link to an audio file. It is saved on this device.</div>' +
            '</div>' +
            '<div class="music-row" id="musicFileRow"' + (mSrc === 'file' ? '' : ' hidden') + '>' +
            '<div class="music-inline"><button class="btn btn-ghost btn-sm" id="musicFilePick" type="button">' + ic('upload', 16) + ' Choose file</button>' +
            '<button class="icon-btn danger" id="musicFileRemove" type="button" aria-label="Remove music file"' + (mFile ? '' : ' hidden') + '>' + ic('trash', 18) + '</button></div>' +
            '<div class="music-note" id="musicFileName">' + (mFile ? 'Saved: ' + esc(mFile) : 'No audio file saved yet. Pick an MP3 or M4A from your device.') + '</div>' +
            '</div>' +
            '<div class="music-row"><label class="music-label" for="musicVolume">Volume <span id="musicVolValue">' + mVol + '%</span></label>' +
            '<input type="range" id="musicVolume" class="range" min="0" max="100" value="' + mVol + '"></div>' +
            '</div>' +
            '<div class="list-item" style="margin-top:8px"><span class="ic' + (hasSpot ? ' spotify-ic' : ' subdued') + '">' + ic(hasSpot ? 'spotify' : 'link', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Spotify song</div>' +
            '<div class="list-item-sub">' + (hasSpot ? 'Connected to Spotify' : 'Save a link, then open it in the Spotify app') + '</div></div>' +
            '<button class="btn btn-ghost btn-sm" id="musicSpotifyOpen" type="button"' + (hasSpot ? '' : ' hidden') + '>Open</button></div>' +
            '<div class="music-panel" id="spotifyPanel">' +
            '<div class="music-row"><div class="music-inline"><input type="url" id="musicSpotifyInput" class="input" placeholder="https://open.spotify.com/track/..." value="' + esc(spotUrl) + '">' +
            '<button class="btn btn-primary btn-sm" id="musicSpotifySave" type="button">Save</button></div>' +
            '<div class="music-note">Playback happens inside Spotify. The link is saved on this device.</div>' +
            '</div></div>' +
            '</div></div>';

        var profileHTML;
        if (c) {
            profileHTML = '<div class="profile-row current">' +
                avatarHTML(c.person1.photo, coupleInitials(c), 'avatar-lg') +
                '<div class="profile-row-main">' +
                '<div class="profile-row-name">' + esc((c.person1 && c.person1.name) || 'Person 1') + ' &amp; ' + esc((c.person2 && c.person2.name) || 'Person 2') + '</div>' +
                '<div class="profile-row-sub">' + (c.startDate ? fmtDateLong(c.startDate) : 'No start date') + '</div>' +
                '</div>' +
                '<div class="profile-row-actions">' +
                '<button class="icon-btn" data-action="editProfile" aria-label="Edit profile">' + ic('edit', 20) + '</button>' +
                '<button class="icon-btn" data-action="switchProfile" aria-label="Switch profile">' + ic('refresh', 20) + '</button>' +
                '</div></div>';
        } else {
            profileHTML = '<div class="empty"><span class="ic">' + ic('user', 44) + '</span>' +
                '<div class="empty-title">No profile</div><div class="empty-text">Create a couple profile to begin.</div>' +
                '<button class="btn btn-primary" data-action="newProfile">Create profile</button></div>';
        }

        var up = upcomingMilestones(c && c.startDate, state.milestones);
        var upcoming = up.list.filter(function (x) { return x.remaining >= 0; }).sort(function (a, b) { return a.remaining - b.remaining; }).slice(0, 4);
        var custom = state.milestones.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

        var isSyncCurrent = state.syncCouple && !!c && !!Sync.coupleId && String(Sync.coupleId) === String(c.id) && state.coupleCode;
        var syncMoreStatus = isSyncCurrent ? syncMoreLabel() : 'Local only';
        var code = state.coupleCode || (c && c.coupleCode) || '';
        var partnerJoined = state.partnerJoined || (c && c.member2 && c.member2.joined);
        var partnerName = state.partnerName || (c && c.person2 && c.person2.name) || '';

        var coupleHTML = '<div class="group"><h4 class="group-title">Couple</h4><div class="list">' +
            '<div class="list-item"><span class="ic subdued">' + ic('cloud', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Cloud sync</div>' +
            '<div class="list-item-sub">' + esc(syncMoreStatus) + '</div></div>' +
            '<span class="sync-dot" data-status="' + esc(state.syncStatus) + '"></span></div>';
        if (!isSyncCurrent && c) {
            coupleHTML += '<button class="list-item" data-action="syncCreate"><span class="ic">' + ic('cloud', 20) + '</span>' +
                '<div class="list-item-main"><div class="list-item-label">Create shared couple</div>' +
                '<div class="list-item-sub">Sync this couple with your partner</div></div>' +
                '<span class="ic chev">' + ic('chevron-right', 18) + '</span></button>';
        }
        if (isSyncCurrent) {
            coupleHTML += '<div class="list-item"><span class="ic subdued">' + ic('link', 20) + '</span>' +
                '<div class="list-item-main"><div class="list-item-label">Invite code</div>' +
                '<div class="list-item-sub" id="inviteCodeSub">' + esc(code) + '</div></div>' +
                '<button class="icon-btn" data-action="copyInvite" aria-label="Copy invite code">' + ic('copy', 18) + '</button>' +
                '<button class="icon-btn" data-action="newInvite" aria-label="New invite code">' + ic('refresh', 18) + '</button></div>';
            coupleHTML += '<div class="list-item"><span class="ic subdued">' + ic('user', 20) + '</span>' +
                '<div class="list-item-main"><div class="list-item-label">Partner</div>' +
                '<div class="list-item-sub" id="partnerSub">' + (partnerJoined ? 'Connected · ' + esc(partnerName) + (state.partnerOnline ? ' · Online' : ' · Offline') : 'Waiting for partner to join') + '</div></div></div>';
        }
        coupleHTML += '</div></div>';

        var msHTML = '<div class="group"><h4 class="group-title">Milestones</h4><div class="list">';
        if (upcoming.length) {
            upcoming.forEach(function (x) {
                msHTML += '<div class="list-item"><span class="ic subdued">' + ic('flag', 20) + '</span>' +
                    '<div class="list-item-main"><div class="list-item-label">' + esc(x.title) + '</div>' +
                    '<div class="list-item-sub">' + fmtDateLong(x.iso) + ' · ' + (x.remaining === 0 ? 'Today' : plural(x.remaining, 'day')) + '</div></div></div>';
            });
        }
        if (custom.length) {
            custom.forEach(function (m) {
                msHTML += '<div class="list-item"><span class="ic subdued">' + ic('tag', 20) + '</span>' +
                    '<div class="list-item-main"><div class="list-item-label">' + esc(m.title) + '</div>' +
                    '<div class="list-item-sub">' + (m.date ? fmtDateLong(m.date) : 'No date') + '</div></div>' +
                    '<button class="icon-btn" data-action="delMilestone" data-id="' + esc(m.id) + '" aria-label="Delete milestone">' + ic('trash', 20) + '</button></div>';
            });
        }
        msHTML += '<button class="list-item" data-action="addMilestone"><span class="ic">' + ic('plus', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Add milestone</div></div></div></div></div>';

        var profilesHTML = '<div class="group"><h4 class="group-title">Profiles</h4><div class="list">';
        if (state.couples.length) {
            state.couples.forEach(function (p) {
                profilesHTML += '<div class="list-item' + (state.currentProfileId === p.id ? ' current' : '') + '">' +
                    '<span class="ic subdued">' + ic('user', 20) + '</span>' +
                    '<div class="list-item-main"><div class="list-item-label">' + esc((p.person1 && p.person1.name) || 'Person 1') + ' &amp; ' + esc((p.person2 && p.person2.name) || 'Person 2') + '</div>' +
                    '<div class="list-item-sub">' + (p.startDate ? fmtDateLong(p.startDate) : 'No date') + (state.currentProfileId === p.id ? ' · Active' : '') + '</div></div>' +
                    '<button class="icon-btn" data-action="loadProfile" data-id="' + esc(p.id) + '" aria-label="Load profile">' + ic('check', 20) + '</button>' +
                    '<button class="icon-btn" data-action="delProfile" data-id="' + esc(p.id) + '" aria-label="Delete profile">' + ic('trash', 20) + '</button>' +
                    '</div>';
            });
        }
        profilesHTML += '<button class="list-item" data-action="newProfile"><span class="ic">' + ic('plus', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">New profile</div></div></div></div></div>';

        var shareHTML = '<div class="group"><h4 class="group-title">App</h4><div class="list">' +
            '<button class="list-item" data-action="checkUpdate"><span class="ic">' + ic('refresh', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">App updates</div>' +
            '<div class="list-item-sub">Together v' + esc(Updater.currentVersion()) + (Updater.state === 'available' ? ' · Update available' : ' · Check for a newer version') + '</div></div>' +
            '<span class="ic chev">' + ic('chevron-right', 18) + '</span></button>' +
            '<button class="list-item" data-action="share"><span class="ic">' + ic('share', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Share our story</div><div class="list-item-sub">Share a summary with your partner</div></div>' +
            '<span class="ic chev">' + ic('chevron-right', 18) + '</span></button>' +
            '<div class="list-item"><span class="ic subdued">' + ic('info', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Together</div><div class="list-item-sub">Version ' + esc(Updater.currentVersion()) + ' · Your data stays on this device</div></div></div>' +
            '</div></div>';

        el.innerHTML =
            '<div class="group">' + profileHTML + '</div>' +
            coupleHTML +
            '<div class="group"><h4 class="group-title">Appearance</h4><div class="list">' +
            '<div class="list-item"><span class="ic">' + ic('sun', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Theme</div></div>' +
            '<div class="segmented" data-theme-select>' +
            '<button data-theme="light" class="' + (tSel === 'light' ? 'active' : '') + '">Light</button>' +
            '<button data-theme="system" class="' + (tSel === 'system' ? 'active' : '') + '">Auto</button>' +
            '<button data-theme="dark" class="' + (tSel === 'dark' ? 'active' : '') + '">Dark</button>' +
            '</div></div></div></div>' +
            musicHTML +
            '<div class="group"><h4 class="group-title">Data</h4><div class="list">' +
            '<button class="list-item" data-action="export"><span class="ic">' + ic('download', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Export backup</div><div class="list-item-sub">Download all your data as JSON</div></div>' +
            '<span class="ic chev">' + ic('chevron-right', 18) + '</span></button>' +
            '<button class="list-item" data-action="import"><span class="ic">' + ic('upload', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Import backup</div><div class="list-item-sub">Restore from a JSON file</div></div>' +
            '<span class="ic chev">' + ic('chevron-right', 18) + '</span></button>' +
            '<button class="list-item danger" data-action="clear"><span class="ic">' + ic('alert', 20) + '</span>' +
            '<div class="list-item-main"><div class="list-item-label">Delete all data</div></div></button>' +
            '</div></div>' +
            profilesHTML + msHTML + shareHTML;
    }

    function renderAll() {
        updateAppBar();
        renderHome();
        renderPhotos();
        renderTimeline();
        renderMoments();
        renderChat();
        renderMore();
    }

    /* =========================================================
       NAVIGATION
       ========================================================= */
    var currentTab = 'home';

    function goTab(tab) {
        $$('.nav-item').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === tab); });
        $$('.tab').forEach(function (t) { t.hidden = (t.id !== 'tab-' + tab); });
        var c = $('#content');
        if (c) c.scrollTop = 0;
        currentTab = tab;
        if (tab === 'more') renderMore();
        if (tab === 'photos') renderPhotos();
        if (tab === 'timeline') renderTimeline();
        if (tab === 'moments') renderMoments();
        if (tab === 'chat') renderChat();
        if (tab === 'home') renderHome();
    }

    function showScreen(id) {
        ['screen-welcome', 'screen-main'].forEach(function (s) {
            var el = $('#' + s);
            if (el) el.hidden = (s !== id);
        });
    }

    function showMainOrWelcome() {
        if (state.couple) {
            showScreen('screen-main');
            if (state.syncCouple) updateSyncChip(state.syncStatus);
        } else {
            var loadBtn = $('#w-load');
            if (loadBtn) loadBtn.hidden = !(state.couples && state.couples.length);
            showWelcomePage('w-choice');
            showScreen('screen-welcome');
        }
    }

    function hideLoading() {
        var ls = $('#screen-loading');
        if (ls) ls.hidden = true;
        var sp = $('#splash');
        if (sp && !sp.classList.contains('hide')) sp.classList.add('hide');
    }

    /* =========================================================
       SHEETS
       ========================================================= */
    function openSheet(id) {
        var el = $('#' + id);
        if (!el) return;
        el.hidden = false;
    }

    function closeSheet(id) {
        var el = $('#' + id);
        if (el) el.hidden = true;
    }

    function anySheetOpen() {
        return $$('.sheet-backdrop').some(function (el) { return !el.hidden; });
    }

    /* =========================================================
       PROFILE FLOW
       ========================================================= */
    function goNewProfile() {
        resetWelcome();
        var loadBtn = $('#w-load');
        if (loadBtn) loadBtn.hidden = !(state.couples && state.couples.length);
        showScreen('screen-welcome');
    }

    function setCurrentProfile(id) {
        return Store.getCouple(id).then(function (c) {
            state.currentProfileId = id;
            state.couple = c || null;
            Store.saveCurrentId(id);
            if (c && c.coupleCode) {
                state.syncCouple = true;
                state.coupleCode = c.coupleCode;
                if (window.Sync && Sync.ready) Sync.attachCouple(c.id);
            } else {
                state.syncCouple = false;
                state.coupleCode = null;
                state.partnerJoined = false;
                state.partnerName = '';
                if (window.Sync && Sync.ready) Sync.detach();
            }
            return refreshCollections();
        });
    }

    function refreshCollections() {
        var pid = state.currentProfileId;
        if (!pid) {
            state.photos = []; state.memories = []; state.moments = []; state.milestones = []; state.chats = [];
            return Promise.resolve();
        }
        return Promise.all([
            Store.listPhotos(pid),
            Store.listMemories(pid),
            Store.listMoments(pid),
            Store.listMilestones(pid),
            Store.listChats(pid)
        ]).then(function (res) {
            state.photos = res[0]; state.memories = res[1]; state.moments = res[2]; state.milestones = res[3]; state.chats = res[4];
            state.chatIds = {};
            state.chats.forEach(function (m) { state.chatIds[m.id] = 1; });
        });
    }

    function openProfilesSheet() {
        Store.listCouples().then(function (couples) {
            state.couples = couples;
            var list = $('#profilePickList');
            if (!list) return;
            if (!couples.length) {
                list.innerHTML = '<div class="empty"><span class="ic">' + ic('user', 40) + '</span>' +
                    '<div class="empty-title">No profiles yet</div><div class="empty-text">Create one to get started.</div></div>';
            } else {
                list.innerHTML = couples.map(function (c) {
                    return '<div class="profile-row' + (state.currentProfileId === c.id ? ' current' : '') + '">' +
                        avatarHTML(c.person1 && c.person1.photo, coupleInitials(c), 'avatar-lg') +
                        '<div class="profile-row-main">' +
                        '<div class="profile-row-name">' + esc((c.person1 && c.person1.name) || 'Person 1') + ' &amp; ' + esc((c.person2 && c.person2.name) || 'Person 2') + '</div>' +
                        '<div class="profile-row-sub">' + (c.startDate ? fmtDateLong(c.startDate) : 'No start date') + '</div>' +
                        '</div>' +
                        '<div class="profile-row-actions">' +
                        '<button class="icon-btn" data-load="' + esc(c.id) + '" aria-label="Load profile">' + ic('check', 20) + '</button>' +
                        '<button class="icon-btn" data-del="' + esc(c.id) + '" aria-label="Delete profile">' + ic('trash', 20) + '</button>' +
                        '</div></div>';
                }).join('');
            }
            openSheet('sheet-profiles');
        });
    }

    function onProfilePickClick(e) {
        var load = e.target.closest('[data-load]');
        var del = e.target.closest('[data-del]');
        if (load) {
            var id = load.dataset.load;
            if (id === state.currentProfileId) { closeSheet('sheet-profiles'); return; }
            setCurrentProfile(id).then(function () {
                closeSheet('sheet-profiles');
                showScreen('screen-main');
                renderAll();
            });
        }
        if (del) {
            e.stopPropagation();
            deleteProfile(del.dataset.del);
        }
    }

    function deleteProfile(id) {
        var c = state.couples.find(function (x) { return String(x.id) === String(id); });
        var names = c ? ((c.person1 && c.person1.name) || '') + ' & ' + ((c.person2 && c.person2.name) || '') : 'this profile';
        confirmDialog({
            title: 'Delete this profile?',
            text: 'This will permanently delete all data for ' + names + '.',
            confirmText: 'Delete',
            icon: 'trash'
        }).then(function (ok) {
            if (!ok) return;
            Store.deleteCouple(id).then(function () {
                return Store.listCouples();
            }).then(function (couples) {
                state.couples = couples;
                if (String(state.currentProfileId) === String(id)) {
                    state.syncCouple = false;
                    state.coupleCode = null;
                    state.partnerJoined = false;
                    state.partnerName = '';
                    if (couples.length) return setCurrentProfile(couples[0].id);
                    state.couple = null;
                    state.currentProfileId = null;
                    Store.saveCurrentId(null);
                    return refreshCollections();
                }
                return Promise.resolve();
            }).then(function () {
                renderAll();
                if (!$('#sheet-profiles').hidden) openProfilesSheet();
                showMainOrWelcome();
                toast('Profile deleted', 'success');
            }).catch(function () {
                toast('Unable to delete profile.', 'error');
            });
        });
    }

    function openEditProfile() {
        var c = state.couple || { person1: { name: '', photo: null }, person2: { name: '', photo: null }, startDate: '', favoritePlace: '', favoriteActivity: '', note: '' };
        $('#p1Name').value = (c.person1 && c.person1.name) || '';
        $('#p2Name').value = (c.person2 && c.person2.name) || '';
        $('#profStart').value = c.startDate || '';
        $('#profPlace').value = c.favoritePlace || '';
        $('#profActivity').value = c.favoriteActivity || '';
        $('#profNote').value = c.note || '';
        $('#p1Photo').value = (c.person1 && c.person1.photo) || '';
        $('#p2Photo').value = (c.person2 && c.person2.photo) || '';
        $('#p1Avatar').innerHTML = (c.person1 && c.person1.photo) ? '<img src="' + c.person1.photo + '" alt="">' : esc(initials((c.person1 && c.person1.name) || 'P'));
        $('#p2Avatar').innerHTML = (c.person2 && c.person2.photo) ? '<img src="' + c.person2.photo + '" alt="">' : esc(initials((c.person2 && c.person2.name) || 'P'));
        openSheet('sheet-profile');
    }

    function saveProfileHandler() {
        var p1 = ($('#p1Name').value || '').trim();
        var p2 = ($('#p2Name').value || '').trim();
        if (!p1 || !p2) { toast('Please enter both names', 'error'); return; }
        var c = state.couple || {};
        var updated = {
            id: c.id || uid(),
            person1: { name: p1, photo: $('#p1Photo').value || (c.person1 && c.person1.photo) || null },
            person2: { name: p2, photo: $('#p2Photo').value || (c.person2 && c.person2.photo) || null },
            startDate: $('#profStart').value || c.startDate || '',
            favoritePlace: ($('#profPlace').value || '').trim(),
            favoriteActivity: ($('#profActivity').value || '').trim(),
            note: ($('#profNote').value || '').trim(),
            createdAt: c.createdAt || Date.now()
        };
        Store.saveCouple(updated).then(function () {
            state.couple = updated;
            closeSheet('sheet-profile');
            renderAll();
            toast('Profile saved', 'success');
        }).catch(function () {
            toast('Unable to save profile. Please try again.', 'error');
        });
    }

    /* =========================================================
       COUPLE SYNC (invite + realtime)
       ========================================================= */
    function showWelcomePage(pageId) {
        $$('.w-page').forEach(function (p) { p.hidden = (p.id !== pageId); });
    }

    function resetWelcome() {
        $('#w-person1').value = '';
        $('#w-person2').value = '';
        $('#w-start').value = '';
        $('#w-code').value = '';
        $('#w-join-name').value = '';
        var je = $('#w-join-error');
        if (je) { je.hidden = true; je.textContent = ''; }
        showWelcomePage('w-choice');
    }

    function syncUsable() {
        return !!(window.Sync && Sync.ready);
    }

    function canUploadPhoto() {
        return !!(window.Sync && Sync.hasStorage && Sync.hasStorage() && Sync.ready && Sync.authed &&
            Sync.coupleId && state.couple && String(state.couple.id) === String(Sync.coupleId));
    }

    function uploadPhotoBase64(base64, kind, id) {
        var path = Sync.photoPath(Sync.coupleId, kind, id);
        return Sync.uploadData(path, base64).then(function (url) {
            return { photoUrl: url, storagePath: path };
        });
    }

    function setSaveBusy(sel, busy) {
        var b = $(sel);
        if (!b) return;
        b.disabled = busy;
        b.classList.toggle('btn-loading', busy);
    }

    function mapSyncError(e) {
        if (e && e.message === 'not_found') return 'That invite code was not found. Check it and try again.';
        if (e && e.message === 'expired') return 'That invite code has expired. Ask your partner for a new one.';
        if (e && e.message === 'used') return 'That invite code has already been used. Ask your partner for a new one.';
        if (e && e.message === 'full') return 'This couple already has two members.';
        if (e && e.message === 'invalid') return 'Enter a valid invite code.';
        if (e && e.message === 'sync-unavailable') return 'Unable to connect right now. Check your internet connection and try again.';
        return 'Something went wrong. Please try again.';
    }

    function setCreateBusy(busy) {
        var b = $('#w-create');
        if (!b) return;
        b.disabled = busy;
        b.classList.toggle('btn-loading', busy);
        var span = b.querySelector('span');
        if (span && b.lastChild) b.lastChild.textContent = busy ? 'Creating...' : 'Create Couple';
    }

    function setJoinBusy(busy) {
        var b = $('#w-join');
        if (!b) return;
        b.disabled = busy;
        b.classList.toggle('btn-loading', busy);
        var span = b.querySelector('span');
        if (span && b.lastChild) b.lastChild.textContent = busy ? 'Joining...' : 'Join Couple';
    }

    function createCoupleFlow() {
        var n1 = ($('#w-person1').value || '').trim();
        if (!n1) { toast('Please enter your name', 'error'); return; }
        var n2 = ($('#w-person2').value || '').trim();
        var start = $('#w-start').value || '';
        if (!syncUsable()) {
            var local = {
                id: uid(),
                person1: { name: n1, photo: null },
                person2: { name: n2, photo: null },
                startDate: start,
                favoritePlace: '', favoriteActivity: '', note: '',
                createdAt: Date.now()
            };
            Store.saveCouple(local).then(function () {
                return setCurrentProfile(local.id);
            }).then(function () {
                state.syncCouple = false;
                renderAll();
                showScreen('screen-main');
                toast('Created locally. Connect to the internet to share with your partner.', 'success');
            }).catch(function () {
                toast('Unable to create couple. Please try again.', 'error');
            });
            return;
        }
        setCreateBusy(true);
        Sync.createCouple({ yourName: n1, partnerName: n2, startDate: start }).then(function (res) {
            var couple = {
                id: res.coupleId,
                person1: { name: n1, photo: null, memberId: Sync.memberId },
                person2: { name: n2, photo: null },
                startDate: start,
                favoritePlace: '', favoriteActivity: '', note: '',
                createdAt: Date.now(),
                coupleCode: res.code
            };
            return Store.saveCouple(couple).then(function () {
                return setCurrentProfile(couple.id);
            }).then(function () {
                state.syncCouple = true;
                state.coupleCode = res.code;
                renderAll();
                $('#w-invite-code').textContent = res.code;
                showWelcomePage('w-invite-page');
            });
        }).catch(function (e) {
            setCreateBusy(false);
            toast(mapSyncError(e), 'error');
        });
    }

    function joinCoupleFlow() {
        var code = ($('#w-code').value || '').replace(/\s+/g, '').toUpperCase();
        if (!code || code.length < 6) {
            var je = $('#w-join-error');
            je.textContent = 'Enter the 6-character invite code from your partner.';
            je.hidden = false;
            return;
        }
        if (!syncUsable()) {
            var je2 = $('#w-join-error');
            je2.textContent = 'Unable to connect right now. Check your internet connection and try again.';
            je2.hidden = false;
            return;
        }
        setJoinBusy(true);
        var name = ($('#w-join-name').value || '').trim();
        Sync.joinCouple(code, { yourName: name }).then(function (res) {
            var doc = res.couple || {};
            var members = doc.members || {};
            var meta = doc.meta || {};
            var m1 = members.member1 || {};
            var m2 = members.member2 || {};
            var couple = {
                id: res.coupleId,
                person1: { name: m1.name || 'Person 1', photo: m1.photo || null, memberId: m1.id || '' },
                person2: { name: m2.name || meta.partnerName || (name || 'Partner'), photo: m2.photo || null, memberId: m2.id || Sync.memberId },
                startDate: meta.relationshipStartDate || '',
                favoritePlace: meta.favoritePlace || '',
                favoriteActivity: meta.favoriteActivity || '',
                note: meta.note || '',
                createdAt: meta.createdAt || Date.now(),
                coupleCode: code,
                member2: { id: m2.id || Sync.memberId, joined: true }
            };
            return Store.saveCouple(couple).then(function () {
                return setCurrentProfile(couple.id);
            }).then(function () {
                state.syncCouple = true;
                state.coupleCode = code;
                state.partnerJoined = true;
                state.partnerName = (m1.name || '');
                renderAll();
                var partnerName = (m1.name || '').trim();
                $('#w-connected-text').textContent = partnerName ? ('You and ' + partnerName + ' are now sharing this couple space.') : 'You are now sharing your partner\'s couple space.';
                showWelcomePage('w-connected-page');
            });
        }).catch(function (e) {
            setJoinBusy(false);
            var je3 = $('#w-join-error');
            je3.textContent = mapSyncError(e);
            je3.hidden = false;
        });
    }

    function onCoupleReceived(couple) {
        if (!couple || !couple.id) return;
        var pid = String(couple.id);
        state.partnerJoined = !!(couple.member2 && couple.member2.id);
        state.partnerName = (couple.member2 && couple.member2.name) || state.partnerName || '';
        state.partnerOnline = !!(couple.member2 && couple.member2.online);
        state.coupleCode = couple.inviteCode || state.coupleCode;
        if (state.currentProfileId === pid) {
            var c = state.couple || {};
            var merged = {
                id: pid,
                person1: { name: (couple.person1 && couple.person1.name) || (c.person1 && c.person1.name) || 'Person 1', photo: (couple.person1 && couple.person1.photo) || (c.person1 && c.person1.photo) || null, memberId: (couple.person1 && couple.person1.memberId) || '' },
                person2: { name: (couple.person2 && couple.person2.name) || (c.person2 && c.person2.name) || 'Partner', photo: (couple.person2 && couple.person2.photo) || (c.person2 && c.person2.photo) || null, memberId: (couple.person2 && couple.person2.memberId) || '' },
                startDate: couple.startDate || c.startDate || '',
                favoritePlace: couple.favoritePlace || c.favoritePlace || '',
                favoriteActivity: couple.favoriteActivity || c.favoriteActivity || '',
                note: couple.note || c.note || '',
                createdAt: c.createdAt || couple.createdAt || Date.now(),
                coupleCode: couple.inviteCode || c.coupleCode || ''
            };
            state.couple = merged;
            Storage.put('couples', merged).then(function () {
                renderAll();
            }).catch(function () {});
        }
    }

    function mergeStore(store, remoteRecs) {
        var pid = Sync.coupleId;
        if (!pid || !Array.isArray(remoteRecs)) return Promise.resolve();
        var remoteById = {};
        remoteRecs.forEach(function (r) {
            if (r && r.id) remoteById[String(r.id)] = r;
        });
        return Storage.getAll(store).then(function (locals) {
            var localById = {};
            locals.forEach(function (x) {
                if (String(x.profileId) === String(pid)) localById[String(x.id)] = x;
            });
            var jobs = [];
            Object.keys(remoteById).forEach(function (k) {
                var rec = remoteById[k];
                if (isTombstoned(pid, store, k)) {
                    Sync.pushDelete(store, k);
                    delete localById[k];
                    Storage.del(store, k);
                    return;
                }
                var local = localById[k];
                if (local) {
                    if (!rec.data && local.data) rec.data = local.data;
                    if (!rec.photo && local.photo) rec.photo = local.photo;
                }
                rec._synced = true;
                jobs.push(Storage.put(store, rec));
                delete localById[k];
            });
            var localOnly = Object.keys(localById).map(function (k) { return localById[k]; })
                .filter(function (x) { return !isTombstoned(pid, store, String(x.id)); });
            var toUpload = [];
            localOnly.forEach(function (x) {
                if (x._synced) {
                    /* Present locally, confirmed on the server before, but absent
                       from the remote set now: another device deleted it while we
                       were offline. Remove it locally instead of re-uploading. */
                    jobs.push(Storage.del(store, String(x.id)));
                } else {
                    toUpload.push(x);
                }
            });
            Object.keys(localById).forEach(function (k) {
                if (isTombstoned(pid, store, k)) jobs.push(Storage.del(store, k));
            });
            if (toUpload.length) {
                var o = {};
                o[store] = toUpload;
                Sync._uploadLocal(pid, o);
            }
            return Promise.all(jobs);
        }).then(function () {
            if (state.currentProfileId === pid) {
                return refreshCollections().then(renderAll);
            }
            return Promise.resolve();
        }).catch(function () {});
    }

    function updateSyncChip(s) {
        var prev = state.syncStatus;
        state.syncStatus = s || 'idle';
        if (state.syncCouple && (s === 'synced' || s === 'syncing') && (prev === 'offline' || prev === 'failed')) {
            flushTombstones();
        }
        var chip = $('#syncChip');
        if (!chip) return;
        if (!state.syncCouple) { chip.hidden = true; return; }
        var map = {
            connecting: ['Connecting', 'connecting'],
            synced: ['Synced', 'synced'],
            syncing: ['Syncing', 'syncing'],
            offline: ['Offline', 'offline'],
            failed: ['Sync failed', 'failed'],
            idle: ['Sync', 'idle']
        };
        var m = map[state.syncStatus] || map.idle;
        chip.hidden = false;
        chip.dataset.status = m[1];
        $('#syncChipText').textContent = m[0];
    }

    function syncMoreLabel() {
        if (!state.syncCouple) return 'Local only';
        var map = {
            connecting: 'Connecting...',
            synced: 'Synced',
            syncing: 'Syncing...',
            offline: 'Offline',
            failed: 'Sync failed',
            idle: 'Sync'
        };
        return map[state.syncStatus] || 'Synced';
    }

    function resumeSync() {
        if (!window.Sync || !Sync.ready) return;
        var c = state.couple;
        if (c && c.coupleCode) {
            state.syncCouple = true;
            state.coupleCode = c.coupleCode;
            Sync.attachCouple(c.id);
            flushTombstones();
        }
    }

    function initSync() {
        if (!window.Sync) return Promise.resolve();
        Sync.onStatus = function (s) { updateSyncChip(s); };
        Sync.onCouple = function (couple) { onCoupleReceived(couple); };
        Sync.onData = function (store, recs) { mergeStore(store, recs); };
        Sync.onPresence = function (online) {
            state.partnerOnline = !!online;
            if (currentTab === 'more') renderMore();
        };
        Sync.localPut = function (store, rec) { return Storage.put(store, rec); };
        Sync.localGet = function (store, id) { return Storage.get(store, id); };
        Sync.localDel = function (store, id) {
            return Storage.get(store, id).then(function (rec) {
                if (!rec || String(rec.profileId) !== String(Sync.coupleId)) return;
                return Storage.del(store, id);
            });
        };
        Sync.onRemoteDelete = function (store, id) {
            return Storage.get(store, id).then(function (rec) {
                if (!rec || String(rec.profileId) !== String(Sync.coupleId)) return;
                if (Sync.coupleId) addTombstone(Sync.coupleId, store, id);
            });
        };
        return Sync.init().then(function () {
            if (Sync.authed) return;
            setTimeout(function () {
                if (!Sync.authed) {
                    Sync.retry().then(function () {
                        if (Sync.authed) resumeSync();
                    }).catch(function () {});
                }
            }, 5000);
        }).catch(function () {});
    }

    function copyText(txt) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(txt).then(function () { return true; }).catch(function () { return legacyCopy(txt); });
        }
        return Promise.resolve(legacyCopy(txt));
    }

    function legacyCopy(txt) {
        try {
            var ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return true;
        } catch (e) { return false; }
    }

    function copyInviteCode() {
        var code = state.coupleCode;
        if (!code) { toast('No invite code available yet', 'error'); return; }
        copyText(code).then(function (ok) {
            toast(ok ? 'Invite code copied' : 'Could not copy the code', ok ? 'success' : 'error');
        });
    }

    function shareInviteCode() {
        var code = state.coupleCode;
        if (!code) { toast('No invite code available yet', 'error'); return; }
        var text = 'Join our couple space on Together. Your invite code: ' + code;
        if (window.Together && window.Together.share) {
            try { window.Together.share(text); return; } catch (e) {}
        }
        if (navigator.share) {
            navigator.share({ title: 'Together', text: text }).catch(function () {});
            return;
        }
        copyText(text).then(function (ok) {
            toast(ok ? 'Invite details copied' : 'Could not share the code', ok ? 'success' : 'error');
        });
    }

    function regenerateInviteCode() {
        if (!state.syncCouple || !syncUsable()) { toast('Not connected', 'error'); return; }
        confirmDialog({
            title: 'Create a new invite code?',
            text: 'Your current code will stop working. Your partner can rejoin with the new code.',
            confirmText: 'Create new code',
            confirmClass: 'btn-primary',
            icon: 'refresh'
        }).then(function (ok) {
            if (!ok) return;
            Sync.regenerateInvite().then(function (code) {
                state.coupleCode = code;
                renderMore();
                toast('New invite code created', 'success');
            }).catch(function (e) {
                toast(mapSyncError(e), 'error');
            });
        });
    }

    function migrateToSync() {
        var c = state.couple;
        if (!c) return;
        if (!syncUsable()) { toast('Unable to connect right now. Check your internet connection.', 'error'); return; }
        confirmDialog({
            title: 'Create a shared couple?',
            text: 'Your data on this device will be copied to your new shared couple space. You can then invite your partner with a code.',
            confirmText: 'Continue',
            confirmClass: 'btn-primary',
            icon: 'cloud'
        }).then(function (ok) {
            if (!ok) return;
            var oldId = String(c.id);
            var n1 = (c.person1 && c.person1.name) || 'Person 1';
            var n2 = (c.person2 && c.person2.name) || '';
            var start = c.startDate || '';
            Sync.createCouple({ yourName: n1, partnerName: n2, startDate: start }).then(function (res) {
                var newId = res.coupleId;
                var jobs = ['photos', 'memories', 'moments', 'milestones'].map(function (store) {
                    return Storage.getAll(store).then(function (items) {
                        var keep = items.filter(function (x) { return String(x.profileId) !== oldId; });
                        var moved = items.filter(function (x) { return String(x.profileId) === oldId; }).map(function (x) {
                            var n = Object.assign({}, x);
                            n.profileId = newId;
                            return n;
                        });
                        return Storage.replaceAll(store, keep.concat(moved));
                    });
                });
                jobs.push(Storage.del('couples', oldId));
                return Promise.all(jobs);
            }).then(function () {
                var migrated = {
                    id: res.coupleId,
                    person1: { name: n1, photo: c.person1 && c.person1.photo, memberId: Sync.memberId },
                    person2: { name: n2, photo: c.person2 && c.person2.photo },
                    startDate: start,
                    favoritePlace: c.favoritePlace || '',
                    favoriteActivity: c.favoriteActivity || '',
                    note: c.note || '',
                    createdAt: Date.now(),
                    coupleCode: res.code
                };
                return Store.saveCouple(migrated).then(function () {
                    return setCurrentProfile(migrated.id);
                });
            }).then(function () {
                state.syncCouple = true;
                state.coupleCode = res.code;
                Sync._uploadLocal(res.coupleId, {
                    photos: state.photos,
                    memories: state.memories,
                    moments: state.moments,
                    milestones: state.milestones
                });
                renderAll();
                updateSyncChip('syncing');
                toast('Shared couple created', 'success');
            }).catch(function (e) {
                toast(mapSyncError(e), 'error');
            });
        });
    }

    /* =========================================================
       MEMORIES (timeline)
       ========================================================= */
    function openAddMemory() {
        $('#sheetMemoryTitle').textContent = 'Add Memory';
        $('#memEditId').value = '';
        $('#memTitle').value = '';
        $('#memDate').value = todayISO();
        $('#memDesc').value = '';
        $('#memPhotoData').value = '';
        hidePhotoPreview('#memPhotoPreview', '#memPhotoEmpty');
        openSheet('sheet-memory');
    }

    function editMemory(id) {
        var m = state.memories.find(function (x) { return String(x.id) === String(id); });
        if (!m) return;
        $('#sheetMemoryTitle').textContent = 'Edit Memory';
        $('#memEditId').value = m.id;
        $('#memTitle').value = m.title || '';
        $('#memDate').value = m.date || '';
        $('#memDesc').value = m.description || '';
        $('#memPhotoData').value = m.photo || '';
        if (m.photo) showPhotoPreview('#memPhotoPreview', '#memPhotoEmpty', m.photo);
        else hidePhotoPreview('#memPhotoPreview', '#memPhotoEmpty');
        openSheet('sheet-memory');
    }

    function saveMemoryHandler() {
        var title = ($('#memTitle').value || '').trim();
        var date = $('#memDate').value;
        if (!title) { toast('Please add a title', 'error'); return; }
        if (!date) { toast('Please choose a date', 'error'); return; }
        var editId = $('#memEditId').value || null;
        var existing = editId ? state.memories.find(function (x) { return String(x.id) === String(editId); }) : null;
        var newImg = $('#memPhotoData').value || '';
        var rec = {
            id: existing ? existing.id : uid(),
            profileId: state.currentProfileId,
            title: title,
            date: date,
            description: ($('#memDesc').value || '').trim(),
            createdAt: existing ? existing.createdAt : Date.now(),
            updatedAt: Date.now()
        };
        if (existing) {
            rec.photoUrl = existing.photoUrl || '';
            rec.storagePath = existing.storagePath || '';
        }
        var doSave = function () {
            Store.saveMemory(rec).then(function () {
                closeSheet('sheet-memory');
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast(existing ? 'Memory updated' : 'Memory saved', 'success');
            }).catch(function () {
                toast('Unable to save memory. Please try again.', 'error');
            });
        };
        var hasNewPhoto = newImg && newImg.indexOf('data:') === 0 && (!existing || newImg !== existing.photo);
        if (canUploadPhoto() && hasNewPhoto) {
            setSaveBusy('#memSave', true);
            uploadPhotoBase64(newImg, 'memories', rec.id).then(function (r) {
                rec.photo = newImg;
                rec.photoUrl = r.photoUrl;
                rec.storagePath = r.storagePath;
                if (existing && existing.storagePath && existing.storagePath !== r.storagePath) {
                    if (window.Sync && Sync.removeFile) Sync.removeFile(existing.storagePath);
                }
                doSave();
            }).catch(function () {
                setSaveBusy('#memSave', false);
                toast('Photo upload failed. Please try again.', 'error');
            });
        } else if (newImg) {
            if (existing && newImg === existing.photo) {
                rec.photo = existing.photo;
                rec.photoUrl = existing.photoUrl || '';
                rec.storagePath = existing.storagePath || '';
            } else {
                rec.photo = newImg;
                if (newImg.indexOf('data:') === 0) { rec.photoUrl = ''; rec.storagePath = ''; }
            }
            doSave();
        } else {
            rec.photo = existing ? existing.photo : null;
            rec.photoUrl = existing ? (existing.photoUrl || '') : '';
            rec.storagePath = existing ? (existing.storagePath || '') : '';
            doSave();
        }
    }

    function deleteMemory(id) {
        confirmDialog({
            title: 'Delete this memory?',
            text: 'This will permanently remove it from your timeline.',
            confirmText: 'Delete',
            icon: 'trash'
        }).then(function (ok) {
            if (!ok) return;
            var rec = state.memories.find(function (x) { return String(x.id) === String(id); });
            if (rec && rec.storagePath && window.Sync && Sync.removeFile) Sync.removeFile(rec.storagePath);
            Store.deleteMemory(id).then(function () {
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast('Deleted successfully.', 'success');
            }).catch(function () {
                toast('Unable to delete. Please try again.', 'error');
            });
        });
    }

    /* =========================================================
       MOMENTS
       ========================================================= */
    function openAddMoment() {
        $('#sheetMomentTitle').textContent = 'Add Moment';
        $('#momEditId').value = '';
        $('#momTitle').value = '';
        $('#momDate').value = todayISO();
        $('#momDesc').value = '';
        $('#momPhotoData').value = '';
        $('#momCategory').value = 'Date';
        renderMomentCatChips('Date');
        hidePhotoPreview('#momPhotoPreview', '#momPhotoEmpty');
        openSheet('sheet-moment');
    }

    function editMoment(id) {
        var m = state.moments.find(function (x) { return String(x.id) === String(id); });
        if (!m) return;
        $('#sheetMomentTitle').textContent = 'Edit Moment';
        $('#momEditId').value = m.id;
        $('#momTitle').value = m.title || '';
        $('#momDate').value = m.date || '';
        $('#momDesc').value = m.description || '';
        $('#momCategory').value = m.category || 'Date';
        renderMomentCatChips(m.category || 'Date');
        $('#momPhotoData').value = m.photo || '';
        if (m.photo) showPhotoPreview('#momPhotoPreview', '#momPhotoEmpty', m.photo);
        else hidePhotoPreview('#momPhotoPreview', '#momPhotoEmpty');
        openSheet('sheet-moment');
    }

    function renderMomentCatChips(selected) {
        var box = $('#momCats');
        if (!box) return;
        box.innerHTML = CATEGORIES.map(function (c) {
            return '<button type="button" class="chip' + (c === selected ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
        }).join('');
    }

    function saveMomentHandler() {
        var title = ($('#momTitle').value || '').trim();
        var date = $('#momDate').value;
        if (!title) { toast('Please add a title', 'error'); return; }
        if (!date) { toast('Please choose a date', 'error'); return; }
        var editId = $('#momEditId').value || null;
        var existing = editId ? state.moments.find(function (x) { return String(x.id) === String(editId); }) : null;
        var newImg = $('#momPhotoData').value || '';
        var rec = {
            id: existing ? existing.id : uid(),
            profileId: state.currentProfileId,
            title: title,
            date: date,
            category: $('#momCategory').value || 'Other',
            description: ($('#momDesc').value || '').trim(),
            createdAt: existing ? existing.createdAt : Date.now(),
            updatedAt: Date.now()
        };
        if (existing) {
            rec.photoUrl = existing.photoUrl || '';
            rec.storagePath = existing.storagePath || '';
        }
        var doSave = function () {
            Store.saveMoment(rec).then(function () {
                closeSheet('sheet-moment');
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast(existing ? 'Moment updated' : 'Moment saved', 'success');
            }).catch(function () {
                toast('Unable to save moment. Please try again.', 'error');
            });
        };
        var hasNewPhoto = newImg && newImg.indexOf('data:') === 0 && (!existing || newImg !== existing.photo);
        if (canUploadPhoto() && hasNewPhoto) {
            setSaveBusy('#momSave', true);
            uploadPhotoBase64(newImg, 'moments', rec.id).then(function (r) {
                rec.photo = newImg;
                rec.photoUrl = r.photoUrl;
                rec.storagePath = r.storagePath;
                if (existing && existing.storagePath && existing.storagePath !== r.storagePath) {
                    if (window.Sync && Sync.removeFile) Sync.removeFile(existing.storagePath);
                }
                doSave();
            }).catch(function () {
                setSaveBusy('#momSave', false);
                toast('Photo upload failed. Please try again.', 'error');
            });
        } else if (newImg) {
            if (existing && newImg === existing.photo) {
                rec.photo = existing.photo;
                rec.photoUrl = existing.photoUrl || '';
                rec.storagePath = existing.storagePath || '';
            } else {
                rec.photo = newImg;
                if (newImg.indexOf('data:') === 0) { rec.photoUrl = ''; rec.storagePath = ''; }
            }
            doSave();
        } else {
            rec.photo = existing ? existing.photo : null;
            rec.photoUrl = existing ? (existing.photoUrl || '') : '';
            rec.storagePath = existing ? (existing.storagePath || '') : '';
            doSave();
        }
    }

    function deleteMoment(id) {
        confirmDialog({
            title: 'Delete this moment?',
            text: 'This will permanently remove it.',
            confirmText: 'Delete',
            icon: 'trash'
        }).then(function (ok) {
            if (!ok) return;
            var rec = state.moments.find(function (x) { return String(x.id) === String(id); });
            if (rec && rec.storagePath && window.Sync && Sync.removeFile) Sync.removeFile(rec.storagePath);
            Store.deleteMoment(id).then(function () {
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast('Deleted successfully.', 'success');
            }).catch(function () {
                toast('Unable to delete. Please try again.', 'error');
            });
        });
    }

    /* =========================================================
       PHOTOS
       ========================================================= */
    function openAddPhoto() {
        $('#photoData').value = '';
        $('#photoCaption').value = '';
        $('#photoDate').value = todayISO();
        hidePhotoPreview('#photoPreview', '#photoPickEmpty');
        openSheet('sheet-photo');
    }

    function savePhotoHandler() {
        var data = $('#photoData').value;
        if (!data) { toast('Please choose an image', 'error'); return; }
        var rec = {
            id: uid(),
            profileId: state.currentProfileId,
            caption: ($('#photoCaption').value || '').trim(),
            date: $('#photoDate').value || todayISO(),
            createdAt: Date.now()
        };
        var doSave = function () {
            Store.savePhoto(rec).then(function () {
                closeSheet('sheet-photo');
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast('Photo saved', 'success');
            }).catch(function () {
                toast('Unable to save photo. Please try again.', 'error');
            });
        };
        if (canUploadPhoto()) {
            setSaveBusy('#photoSave', true);
            uploadPhotoBase64(data, 'photos', rec.id).then(function (r) {
                rec.data = data;
                rec.photoUrl = r.photoUrl;
                rec.storagePath = r.storagePath;
                doSave();
            }).catch(function () {
                setSaveBusy('#photoSave', false);
                toast('Photo upload failed. Please try again.', 'error');
            });
        } else {
            rec.data = data;
            doSave();
        }
    }

    function deletePhoto(id) {
        confirmDialog({
            title: 'Delete this photo?',
            text: 'This will permanently remove it from your gallery.',
            confirmText: 'Delete',
            icon: 'trash'
        }).then(function (ok) {
            if (!ok) return;
            var rec = state.photos.find(function (x) { return String(x.id) === String(id); });
            if (rec && rec.storagePath && window.Sync && Sync.removeFile) Sync.removeFile(rec.storagePath);
            Store.deletePhoto(id).then(function () {
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast('Deleted successfully.', 'success');
            }).catch(function () {
                toast('Unable to delete. Please try again.', 'error');
            });
        });
    }

    /* =========================================================
       PHOTO VIEWER
       ========================================================= */
    var viewerList = [];
    var viewerIndex = 0;

    function openViewer(index) {
        if (!state.photos.length) return;
        viewerList = state.photos.slice();
        viewerIndex = clamp(index, 0, viewerList.length - 1);
        renderViewer();
        $('#viewer').hidden = false;
    }

    function renderViewer() {
        var p = viewerList[viewerIndex];
        if (!p) return;
        $('#viewerImg').src = p.data || p.photoUrl || '';
        $('#viewerImg').alt = p.caption || 'Photo';
        $('#viewerCount').textContent = viewerList.length > 1 ? (viewerIndex + 1) + ' / ' + viewerList.length : '';
        $('#viewerCaption').textContent = p.caption || '';
        $('#viewerDate').textContent = p.date ? fmtDateLong(p.date) : '';
        $('#viewerPrev').style.visibility = viewerIndex > 0 ? 'visible' : 'hidden';
        $('#viewerNext').style.visibility = viewerIndex < viewerList.length - 1 ? 'visible' : 'hidden';
    }

    function viewerGo(i) {
        if (i < 0 || i >= viewerList.length) return;
        viewerIndex = i;
        renderViewer();
    }

    function closeViewer() {
        $('#viewer').hidden = true;
    }

    /* =========================================================
       SEARCH
       ========================================================= */
    var searchFilter = 'all';
    var searchDebounced = debounce(function (v) { runSearch(v); }, 180);

    function openSearch() {
        searchFilter = 'all';
        $$('#searchChips .chip').forEach(function (c) { c.classList.toggle('active', c.dataset.filter === 'all'); });
        $('#globalSearch').value = '';
        $('#searchResults').innerHTML = '';
        $('#sheet-search').hidden = false;
        setTimeout(function () { $('#globalSearch').focus(); }, 80);
    }

    function closeSearch() {
        $('#sheet-search').hidden = true;
    }

    function runSearch(q) {
        var term = (q || '').toLowerCase().trim();
        var box = $('#searchResults');
        if (!box) return;
        if (!term) { box.innerHTML = ''; return; }
        var out = [];
        if (searchFilter === 'all' || searchFilter === 'photos') {
            state.photos.forEach(function (p) {
                if (((p.caption || '') + ' ' + (p.date || '')).toLowerCase().indexOf(term) >= 0) out.push({ type: 'photo', item: p });
            });
        }
        if (searchFilter === 'all' || searchFilter === 'memories') {
            state.memories.forEach(function (m) {
                if (((m.title || '') + ' ' + (m.description || '') + ' ' + (m.date || '')).toLowerCase().indexOf(term) >= 0) out.push({ type: 'memory', item: m });
            });
        }
        if (searchFilter === 'all' || searchFilter === 'moments') {
            state.moments.forEach(function (m) {
                if (((m.title || '') + ' ' + (m.description || '') + ' ' + (m.category || '') + ' ' + (m.date || '')).toLowerCase().indexOf(term) >= 0) out.push({ type: 'moment', item: m });
            });
        }
        if (searchFilter === 'all' || searchFilter === 'milestones') {
            var up = upcomingMilestones(state.couple && state.couple.startDate, state.milestones).list;
            up.forEach(function (x) {
                if (x.title.toLowerCase().indexOf(term) >= 0) out.push({ type: 'milestone', item: x });
            });
        }
        renderSearchResults(out, term);
    }

    function renderSearchResults(out, term) {
        var box = $('#searchResults');
        if (!out.length) {
            box.innerHTML = '<div class="empty"><span class="ic">' + ic('search', 40) + '</span>' +
                '<div class="empty-title">Nothing found</div><div class="empty-text">No results for &ldquo;' + esc(term) + '&rdquo;.</div></div>';
            return;
        }
        var groups = { photo: [], memory: [], moment: [], milestone: [] };
        out.forEach(function (r) { groups[r.type].push(r); });
        var titles = { photo: 'Photos', memory: 'Memories', moment: 'Moments', milestone: 'Milestones' };
        var html = '';
        Object.keys(titles).forEach(function (type) {
            if (!groups[type].length) return;
            html += '<div class="search-result-group-title">' + titles[type] + '</div>';
            groups[type].forEach(function (r) {
                var item = r.item;
                if (type === 'photo') {
                    html += '<button class="search-result" data-type="photo" data-id="' + esc(item.id) + '">' +
                        '<span class="search-result-thumb"><img src="' + item.data + '" alt="" loading="lazy"></span>' +
                        '<span class="search-result-main"><span class="search-result-title">' + esc(item.caption || 'Photo') + '</span>' +
                        '<span class="search-result-sub">' + (item.date ? fmtDateLong(item.date) : '') + '</span></span>' +
                        '<span class="search-result-type">Photo</span></button>';
                } else if (type === 'memory') {
                    html += '<button class="search-result" data-type="memory" data-id="' + esc(item.id) + '">' +
                        '<span class="search-result-thumb">' + (item.photo ? '<img src="' + item.photo + '" alt="" loading="lazy">' : '<span class="ic">' + ic('file', 20) + '</span>') + '</span>' +
                        '<span class="search-result-main"><span class="search-result-title">' + esc(item.title) + '</span>' +
                        '<span class="search-result-sub">' + (item.date ? fmtDateLong(item.date) : '') + '</span></span>' +
                        '<span class="search-result-type">Memory</span></button>';
                } else if (type === 'moment') {
                    html += '<button class="search-result" data-type="moment" data-id="' + esc(item.id) + '">' +
                        '<span class="search-result-thumb">' + (item.photo ? '<img src="' + item.photo + '" alt="" loading="lazy">' : '<span class="ic">' + ic('star', 20) + '</span>') + '</span>' +
                        '<span class="search-result-main"><span class="search-result-title">' + esc(item.title) + '</span>' +
                        '<span class="search-result-sub">' + (item.date ? fmtDateLong(item.date) + ' · ' : '') + esc(item.category || '') + '</span></span>' +
                        '<span class="search-result-type">Moment</span></button>';
                } else {
                    html += '<button class="search-result" data-type="milestone" data-id="' + esc(item.id || '') + '">' +
                        '<span class="search-result-thumb"><span class="ic">' + ic('flag', 20) + '</span></span>' +
                        '<span class="search-result-main"><span class="search-result-title">' + esc(item.title) + '</span>' +
                        '<span class="search-result-sub">' + (item.iso ? fmtDateLong(item.iso) : '') + (typeof item.remaining === 'number' ? ' · ' + (item.remaining < 0 ? 'past' : plural(item.remaining, 'day')) : '') + '</span></span>' +
                        '<span class="search-result-type">Milestone</span></button>';
                }
            });
        });
        box.innerHTML = html;
    }

    /* =========================================================
       MILESTONES
       ========================================================= */
    function openAddMilestone() {
        $('#msTitle').value = '';
        $('#msDate').value = todayISO();
        $('#msDesc').value = '';
        openSheet('sheet-milestone');
    }

    function saveMilestoneHandler() {
        var title = ($('#msTitle').value || '').trim();
        var date = $('#msDate').value;
        if (!title) { toast('Please add a title', 'error'); return; }
        if (!date) { toast('Please choose a date', 'error'); return; }
        var rec = {
            id: uid(),
            profileId: state.currentProfileId,
            title: title,
            date: date,
            description: ($('#msDesc').value || '').trim(),
            createdAt: Date.now()
        };
        Store.saveMilestone(rec).then(function () {
            closeSheet('sheet-milestone');
            return refreshCollections();
        }).then(function () {
            renderAll();
            toast('Milestone saved', 'success');
        }).catch(function () {
            toast('Unable to save milestone.', 'error');
        });
    }

    function deleteMilestone(id) {
        confirmDialog({
            title: 'Delete this milestone?',
            text: 'This will permanently remove it.',
            confirmText: 'Delete',
            icon: 'trash'
        }).then(function (ok) {
            if (!ok) return;
            Store.deleteMilestone(id).then(function () {
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast('Deleted successfully.', 'success');
            }).catch(function () {
                toast('Unable to delete milestone.', 'error');
            });
        });
    }

    /* =========================================================
       THEME
       ========================================================= */
    function applyTheme() {
        var t = state.settings.theme || 'system';
        var eff = t;
        if (t === 'system') eff = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', eff);
        var meta = $('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', eff === 'dark' ? '#17161b' : '#f6f5f3');
        $$('[data-theme-select] button').forEach(function (b) {
            b.classList.toggle('active', b.dataset.theme === t);
        });
        try {
            if (window.Together && window.Together.setSystemBarTheme) window.Together.setSystemBarTheme(eff);
        } catch (e) {}
    }

    function setTheme(t) {
        state.settings.theme = t;
        Store.saveSettings(state.settings);
        applyTheme();
    }

    /* =========================================================
       BACKGROUND MUSIC
       Sources: ambient (romantic/chill), audio link, uploaded file
       ========================================================= */
    var Music = {
        ctx: null,
        master: null,
        filter: null,
        timer: null,
        audio: null,
        objUrl: null,
        playing: false,
        chordIdx: 0,
        MOODS: {
            romantic: {
                chords: [
                    [220.00, 261.63, 329.63],
                    [174.61, 220.00, 261.63],
                    [196.00, 261.63, 329.63],
                    [196.00, 246.94, 293.66]
                ],
                type: 'triangle', speed: 4200, cutoff: 1200, base: 0.14, chordGain: 0.4
            },
            chill: {
                chords: [
                    [146.83, 220.00, 293.66],
                    [130.81, 196.00, 261.63],
                    [164.81, 220.00, 329.63],
                    [110.00, 164.81, 246.94]
                ],
                type: 'sine', speed: 5600, cutoff: 900, base: 0.10, chordGain: 0.3
            }
        },
        mood: function () {
            return this.MOODS[state.settings.musicMood] || this.MOODS.romantic;
        },
        source: function () {
            var s = state.settings;
            if (s.musicSource === 'url' && s.musicUrl) return { kind: 'url', src: s.musicUrl };
            if (s.musicSource === 'file' && s.musicFileId) return { kind: 'file', id: s.musicFileId };
            return { kind: 'ambient' };
        },
        volume: function () {
            return clamp(state.settings.musicVolume != null ? state.settings.musicVolume : 0.7, 0, 1);
        },
        start: function () {
            var self = this;
            if (this.playing) return;
            var src = this.source();
            this.playing = true;
            if (src.kind === 'url') { this._startAudio(src.src); return; }
            if (src.kind === 'file') {
                Storage.get('files', src.id).then(function (rec) {
                    if (!rec || !rec.data) {
                        self.playing = false;
                        toast('Saved music file is missing.', 'error');
                        return;
                    }
                    if (typeof rec.data === 'string') self._startAudio(rec.data);
                    else {
                        try {
                            self.objUrl = URL.createObjectURL(rec.data);
                            self._startAudio(self.objUrl);
                        } catch (e) {
                            self.playing = false;
                            toast('Unable to play the saved music file.', 'error');
                        }
                    }
                }).catch(function () {
                    self.playing = false;
                });
                return;
            }
            this._startAmbient();
        },
        _startAmbient: function () {
            var self = this;
            try {
                this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
                if (this.ctx.state === 'suspended') this.ctx.resume();
                this.master = this.master || this.ctx.createGain();
                this.filter = this.filter || this.ctx.createBiquadFilter();
                var mood = this.mood();
                this.filter.type = 'lowpass';
                this.filter.frequency.value = mood.cutoff;
                this.filter.Q.value = 0.5;
                this.filter.connect(this.master);
                this.master.connect(this.ctx.destination);
                var now = this.ctx.currentTime;
                this.master.gain.cancelScheduledValues(now);
                this.master.gain.setValueAtTime(0.0001, now);
                this.master.gain.linearRampToValueAtTime(mood.base * (0.4 + 0.6 * this.volume()), now + 2.5);
                this.chordIdx = 0;
                this.playChord();
                this.timer = setInterval(function () { self.playChord(); }, mood.speed);
                this.playing = true;
            } catch (e) {
                console.warn('Music unavailable:', e);
                this.playing = false;
            }
        },
        _startAudio: function (src) {
            var self = this;
            var a = this.audio || (this.audio = new Audio());
            a.loop = true;
            a.volume = this.volume();
            a.preload = 'auto';
            a.src = src;
            a.play().catch(function () {
                self.playing = false;
                toast('Could not play that audio source.', 'error');
            });
        },
        stop: function () {
            this.playing = false;
            if (this.timer) { clearInterval(this.timer); this.timer = null; }
            if (this.audio) {
                try { this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); } catch (e) {}
            }
            if (this.objUrl) {
                try { URL.revokeObjectURL(this.objUrl); } catch (e) {}
                this.objUrl = null;
            }
            if (this.ctx && this.master) {
                try {
                    var now = this.ctx.currentTime;
                    this.master.gain.cancelScheduledValues(now);
                    this.master.gain.linearRampToValueAtTime(0.0001, now + 0.5);
                } catch (e) {}
            }
        },
        restart: function () {
            if (this.playing) { this.stop(); this.start(); }
        },
        setVolume: function (vol) {
            vol = clamp(vol == null ? 0.7 : vol, 0, 1);
            if (this.audio) this.audio.volume = vol;
            if (this.ctx && this.master) {
                try {
                    var mood = this.mood();
                    var now = this.ctx.currentTime;
                    this.master.gain.cancelScheduledValues(now);
                    this.master.gain.linearRampToValueAtTime(mood.base * (0.4 + 0.6 * vol), now + 0.15);
                } catch (e) {}
            }
        },
        playChord: function () {
            if (!this.ctx || !this.filter) return;
            var mood = this.mood();
            var now = this.ctx.currentTime;
            var chord = mood.chords[this.chordIdx];
            this.chordIdx = (this.chordIdx + 1) % mood.chords.length;
            var dur = (mood.speed / 1000) - 0.1;
            chord.forEach(function (freq) {
                var o = this.ctx.createOscillator();
                o.type = mood.type;
                o.frequency.value = freq;
                var g = this.ctx.createGain();
                g.gain.setValueAtTime(0.0001, now);
                g.gain.linearRampToValueAtTime(mood.chordGain, now + Math.min(2, dur * 0.4));
                g.gain.linearRampToValueAtTime(0.0001, now + dur);
                o.connect(g);
                g.connect(this.filter);
                o.start(now);
                o.stop(now + dur + 0.1);
            }, this);
        }
    };

    function musicStatusText() {
        var s = state.settings;
        if (s.musicSource === 'url') return s.musicUrl ? 'Playing from link' : 'Link source';
        if (s.musicSource === 'file') return s.musicFileName ? 'Playing ' + s.musicFileName : 'File source';
        return s.musicMood === 'chill' ? 'Ambient · Chill' : 'Ambient · Romantic';
    }

    function readFileAsDataURL(file) {
        return new Promise(function (resolve, reject) {
            var r = new FileReader();
            r.onload = function () { resolve(r.result); };
            r.onerror = function () { reject(r.error); };
            r.readAsDataURL(file);
        });
    }

    function openExternal(url) {
        if (!url) { toast('Save a link first', 'error'); return; }
        try {
            if (window.Together && typeof window.Together.open === 'function') {
                window.Together.open(url);
                return;
            }
        } catch (e) {}
        try { location.href = url; } catch (e) {}
    }

    function toggleMusic(on) {
        var s = state.settings;
        if (on && ((s.musicSource === 'url' && !s.musicUrl) || (s.musicSource === 'file' && !s.musicFileId))) {
            s.musicSource = 'ambient';
        }
        s.music = on;
        Store.saveSettings(state.settings);
        if (on) Music.start();
        else Music.stop();
    }

    /* =========================================================
       SHARE
       ========================================================= */
    function shareStory() {
        var c = state.couple;
        if (!c) { toast('Set up your profile first', 'error'); return; }
        var dur = computeDuration(c.startDate);
        var text = 'Our Story\n\n' + (c.person1 && c.person1.name || '') + ' & ' + (c.person2 && c.person2.name || '') +
            '\nTogether since ' + (c.startDate ? fmtDateLong(c.startDate) : '...') +
            '\n\n' + dur.totalDays.toLocaleString() + ' days together' +
            '\n' + state.memories.length + ' memories · ' + state.photos.length + ' photos · ' + state.moments.length + ' moments';
        var data = { title: 'Together', text: text, url: location.href };
        if (navigator.share) {
            navigator.share(data).catch(function () {});
        } else {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    toast('Summary copied to clipboard', 'success');
                }).catch(function () {
                    downloadTextFile(text, 'together-story.txt');
                    toast('Summary downloaded', 'success');
                });
            } else {
                downloadTextFile(text, 'together-story.txt');
                toast('Summary downloaded', 'success');
            }
        }
    }

    /* =========================================================
       EXPORT / IMPORT
       ========================================================= */
    function exportBackup() {
        Store.exportAll().then(function (data) {
            downloadTextFile(JSON.stringify(data, null, 2), 'together-backup-' + todayISO() + '.json', 'application/json');
            toast('Backup exported', 'success');
        }).catch(function () {
            toast('Backup could not be created.', 'error');
        });
    }

    var pendingImport = null;

    function handleImportFile(file) {
        var reader = new FileReader();
        reader.onload = function () {
            try {
                var data = JSON.parse(reader.result);
                validateBackup(data);
                pendingImport = data;
                $('#importText').textContent = 'Backup contains:\n\nProfiles: ' + (data.couples || []).length +
                    '\nPhotos: ' + (data.photos || []).length +
                    '\nMemories: ' + (data.memories || []).length +
                    '\nMoments: ' + (data.moments || []).length +
                    '\nMilestones: ' + (data.milestones || []).length +
                    '\n\nThis will replace all current data.';
                $('#importDialog').hidden = false;
            } catch (e) {
                toast('Invalid or corrupted backup.', 'error');
            }
        };
        reader.onerror = function () { toast('Unable to read the file.', 'error'); };
        reader.readAsText(file);
    }

    function validateBackup(data) {
        if (!data || data.app !== 'together' || !data.version) throw new Error('invalid');
        return true;
    }

    function doImport(data) {
        Store.importAll(data).then(function () {
            return Store.listCouples();
        }).then(function (couples) {
            state.couples = couples;
            if (couples.length) {
                var first = (data.couples && data.couples.length) ? data.couples[0].id : couples[0].id;
                return setCurrentProfile(first);
            }
            state.couple = null;
            state.currentProfileId = null;
            state.syncCouple = false;
            state.coupleCode = null;
            state.partnerJoined = false;
            state.partnerName = '';
            if (window.Sync && Sync.ready) Sync.detach();
            Store.saveCurrentId(null);
            return refreshCollections();
        }).then(function () {
            applyTheme();
            if (state.settings.music) Music.start(); else Music.stop();
            renderAll();
            showMainOrWelcome();
            toast('Backup restored', 'success');
        }).catch(function () {
            toast('Restore failed. Invalid or corrupted backup.', 'error');
        });
    }

    function clearAllData() {
        confirmDialog({
            title: 'Delete all data?',
            text: 'This will permanently delete all couple data, photos, memories, moments, and settings.',
            confirmText: 'Delete Everything',
            icon: 'alert'
        }).then(function (ok) {
            if (!ok) return;
            Store.clearAll().then(function () {
                state.couple = null;
                state.couples = [];
                state.currentProfileId = null;
                state.photos = [];
                state.memories = [];
                state.moments = [];
                state.milestones = [];
                state.syncCouple = false;
                state.coupleCode = null;
                state.partnerJoined = false;
                state.partnerName = '';
                state.settings = defaultSettings();
                if (window.Sync && Sync.ready) Sync.detach();
                Music.stop();
                applyTheme();
                renderAll();
                showMainOrWelcome();
                toast('All data deleted', 'success');
            }).catch(function () {
                toast('Unable to clear data.', 'error');
            });
        });
    }

    /* =========================================================
       DELETE TOMBSTONES (prevent sync merges from resurrecting
       items deleted locally while offline / on write failure)
       ========================================================= */
    var DEL_TLS = 'together_deleted';

    function loadTombstones() {
        try { return JSON.parse(localStorage.getItem(DEL_TLS) || '[]'); } catch (e) { return []; }
    }
    function saveTombstones(list) {
        try { localStorage.setItem(DEL_TLS, JSON.stringify(list)); } catch (e) {}
    }
    function addTombstone(coupleId, store, id) {
        if (!coupleId || !store || !id) return;
        var list = loadTombstones();
        var key = store + ':' + id;
        if (list.some(function (t) { return t.coupleId === coupleId && t.store + ':' + t.id === key; })) return;
        list.push({ coupleId: String(coupleId), store: store, id: String(id), at: Date.now() });
        saveTombstones(list.slice(-600));
    }
    function isTombstoned(coupleId, store, id) {
        return loadTombstones().some(function (t) {
            return t.coupleId === coupleId && t.store === store && t.id === String(id);
        });
    }
    function flushTombstones() {
        if (!window.Sync || !Sync.ready || !Sync.coupleId) return;
        loadTombstones().forEach(function (t) {
            if (t.coupleId === String(Sync.coupleId)) Sync.pushDelete(t.store, t.id);
        });
    }

    /* =========================================================
       DELEGATED CLICK HANDLERS
       ========================================================= */
    function onPhotoGridClick(e) {
        var del = e.target.closest('[data-del]');
        if (del) {
            e.stopPropagation();
            deletePhoto(del.dataset.del);
            return;
        }
        var tile = e.target.closest('[data-id]');
        if (tile) {
            var idx = state.photos.findIndex(function (p) { return String(p.id) === String(tile.dataset.id); });
            if (idx >= 0) openViewer(idx);
        }
    }

    function onTimelineClick(e) {
        var btn = e.target.closest('[data-act]');
        if (!btn) return;
        var card = btn.closest('[data-mid]');
        if (!card) return;
        var id = card.dataset.mid;
        if (btn.dataset.act === 'edit') editMemory(id);
        else if (btn.dataset.act === 'del') deleteMemory(id);
    }

    function onMomentClick(e) {
        var btn = e.target.closest('[data-act]');
        if (!btn) return;
        var card = btn.closest('[data-mid]');
        if (!card) return;
        var id = card.dataset.mid;
        if (btn.dataset.act === 'edit') editMoment(id);
        else if (btn.dataset.act === 'del') deleteMoment(id);
    }

    function onMomentChipClick(e) {
        var b = e.target.closest('[data-cat]');
        if (!b) return;
        momentFilter = b.dataset.cat;
        renderMoments();
    }

    function onMoreClick(e) {
        var themeBtn = e.target.closest('button[data-theme]');
        if (themeBtn) {
            setTheme(themeBtn.dataset.theme);
            renderMore();
            toast('Theme updated', 'success');
            return;
        }
        var srcBtn = e.target.closest('[data-msrc]');
        if (srcBtn) {
            state.settings.musicSource = srcBtn.dataset.msrc;
            Store.saveSettings(state.settings);
            Music.restart();
            renderMore();
            return;
        }
        var moodBtn = e.target.closest('[data-mmood]');
        if (moodBtn) {
            state.settings.musicMood = moodBtn.dataset.mmood;
            Store.saveSettings(state.settings);
            Music.restart();
            renderMore();
            return;
        }
        var id = e.target.closest('button') ? e.target.closest('button').id : '';
        if (id === 'musicUrlSave') { saveMusicUrl(); return; }
        if (id === 'musicFilePick') { pickMusicFile(); return; }
        if (id === 'musicFileRemove') { removeMusicFile(); return; }
        if (id === 'musicSpotifySave') { saveSpotifyUrl(); return; }
        if (id === 'musicSpotifyOpen') { openExternal(state.settings.spotifyUrl); return; }

        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var act = btn.dataset.action;
        if (act === 'editProfile') openEditProfile();
        else if (act === 'switchProfile') openProfilesSheet();
        else if (act === 'newProfile') goNewProfile();
        else if (act === 'export') exportBackup();
        else if (act === 'import') $('#file-import').click();
        else if (act === 'clear') clearAllData();
        else if (act === 'share') shareStory();
        else if (act === 'syncCreate') migrateToSync();
        else if (act === 'copyInvite') copyInviteCode();
        else if (act === 'newInvite') regenerateInviteCode();
        else if (act === 'addMilestone') openAddMilestone();
        else if (act === 'delMilestone') deleteMilestone(btn.dataset.id);
        else if (act === 'checkUpdate') Updater.open();
        else if (act === 'loadProfile') {
            if (btn.dataset.id !== state.currentProfileId) {
                setCurrentProfile(btn.dataset.id).then(function () {
                    renderAll();
                    toast('Profile loaded', 'success');
                });
            }
        } else if (act === 'delProfile') {
            deleteProfile(btn.dataset.id);
        }
    }

    function onMoreChange(e) {
        if (e.target.id === 'setMusic') {
            toggleMusic(e.target.checked);
            renderMore();
        }
    }

    function onMoreInput(e) {
        if (e.target.id === 'musicVolume') {
            var v = parseInt(e.target.value, 10) / 100;
            state.settings.musicVolume = clamp(v, 0, 1);
            Store.saveSettings(state.settings);
            Music.setVolume(state.settings.musicVolume);
            var lbl = $('#musicVolValue');
            if (lbl) lbl.textContent = Math.round(state.settings.musicVolume * 100) + '%';
        }
    }

    function saveMusicUrl() {
        var url = ($('#musicUrlInput').value || '').trim();
        if (!/^https?:\/\//i.test(url)) { toast('Enter a valid link starting with http(s)://', 'error'); return; }
        state.settings.musicUrl = url;
        Store.saveSettings(state.settings);
        Music.restart();
        toast('Music link saved', 'success');
    }

    function saveSpotifyUrl() {
        var url = ($('#musicSpotifyInput').value || '').trim();
        if (!url || !/^(https?:\/\/|spotify:)/i.test(url)) { toast('Enter a valid Spotify link', 'error'); return; }
        state.settings.spotifyUrl = url;
        Store.saveSettings(state.settings);
        renderMore();
        toast('Spotify link saved', 'success');
    }

    function pickMusicFile() {
        pickFile('file-music', function (f) {
            if (!f) return;
            var rec = {
                id: uid(),
                profileId: '',
                name: f.name || 'audio',
                type: f.type || 'audio/*',
                createdAt: Date.now()
            };
            var done = function () {
                state.settings.musicFileId = rec.id;
                state.settings.musicFileName = rec.name;
                Store.saveSettings(state.settings);
                Music.restart();
                renderMore();
                toast('Music file saved', 'success');
            };
            if (Storage.mode === 'idb') {
                rec.data = f;
                Storage.put('files', rec).then(done).catch(function () {
                    toast('Could not save that audio file.', 'error');
                });
            } else {
                readFileAsDataURL(f).then(function (d) {
                    rec.data = d;
                    return Storage.put('files', rec);
                }).then(done).catch(function () {
                    toast('Could not save that audio file.', 'error');
                });
            }
        });
    }

    function removeMusicFile() {
        var id = state.settings.musicFileId;
        state.settings.musicFileId = null;
        state.settings.musicFileName = '';
        if (state.settings.musicSource === 'file') state.settings.musicSource = 'ambient';
        Store.saveSettings(state.settings);
        if (id) Storage.del('files', id).catch(function () {});
        Music.restart();
        renderMore();
        toast('Music file removed', 'success');
    }

    function onHomeClick(e) {
        var edit = e.target.closest('[data-home="edit"]');
        if (edit) { openEditProfile(); return; }
        var act = e.target.closest('[data-action]');
        if (act) {
            var a = act.dataset.action;
            if (a === 'addPhoto') openAddPhoto();
            else if (a === 'addMemory') openAddMemory();
            else if (a === 'addMoment') openAddMoment();
            return;
        }
        var rec = e.target.closest('[data-recent]');
        if (rec) {
            var kind = rec.dataset.kind;
            var id = rec.dataset.id;
            if (kind === 'photo') {
                var idx = state.photos.findIndex(function (p) { return String(p.id) === String(id); });
                if (idx >= 0) openViewer(idx);
            } else if (kind === 'memory') {
                goTab('timeline');
            } else if (kind === 'moment') {
                goTab('moments');
            }
        }
    }

    function onSearchResultClick(e) {
        var r = e.target.closest('[data-type]');
        if (!r) return;
        var type = r.dataset.type;
        var id = r.dataset.id;
        closeSearch();
        if (type === 'photo') {
            var idx = state.photos.findIndex(function (p) { return String(p.id) === String(id); });
            if (idx >= 0) { goTab('photos'); openViewer(idx); }
        } else if (type === 'memory') {
            goTab('timeline');
        } else if (type === 'moment') {
            goTab('moments');
        } else if (type === 'milestone') {
            goTab('more');
        }
    }

    /* =========================================================
       EVENT BINDING
       ========================================================= */
    var imgLoadRetries = {};

    function bindEvents() {
        $('#w-create-btn').addEventListener('click', function () { showWelcomePage('w-create-page'); });
        $('#w-join-btn').addEventListener('click', function () { showWelcomePage('w-join-page'); });
        $$('.w-back').forEach(function (b) {
            b.addEventListener('click', function () { showWelcomePage(b.dataset.wpage); });
        });
        $('#w-create').addEventListener('click', createCoupleFlow);
        $('#w-join').addEventListener('click', joinCoupleFlow);
        $('#w-code').addEventListener('input', function (e) {
            e.target.value = e.target.value.toUpperCase().replace(/\s+/g, '');
        });
        $('#w-copy').addEventListener('click', copyInviteCode);
        $('#w-share').addEventListener('click', shareInviteCode);
        $('#w-invite-done').addEventListener('click', showMainOrWelcome);
        $('#w-connected-done').addEventListener('click', showMainOrWelcome);
        $('#w-load').addEventListener('click', openProfilesSheet);

        $('#appBarProfile').addEventListener('click', openProfilesSheet);
        $('#searchBtn').addEventListener('click', openSearch);
        $('#settingsBtn').addEventListener('click', function () { goTab('more'); });

        $('#updateBtn').addEventListener('click', function () { Updater.open(); });
        $('#updateNow').addEventListener('click', function () { Updater.onUpdateNow(); });
        $('#updateRemind').addEventListener('click', function () { Updater.remindLater(); });
        $('#updateClose').addEventListener('click', function () { Updater.hideDialog(); });
        $('#updateDialog').addEventListener('click', function (e) {
            if (e.target === $('#updateDialog')) Updater.hideDialog();
        });

        $$('.nav-item').forEach(function (b) {
            b.addEventListener('click', function () { goTab(b.dataset.tab); });
        });

        $('#addPhotoTop').addEventListener('click', openAddPhoto);
        $('#addMemoryTop').addEventListener('click', openAddMemory);
        $('#addMomentTop').addEventListener('click', openAddMoment);

        $('#chatSend').addEventListener('click', chatSend);
        $('#chatInput').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); chatSend(); }
        });
        $('#chatAttach').addEventListener('click', chatPickPhoto);
        $('#chatAttachClear').addEventListener('click', function () {
            chatPendingPhoto = null;
            updateChatAttachUI();
        });

        $('#photoSearch').addEventListener('input', renderPhotos);
        $('#memorySearch').addEventListener('input', renderTimeline);
        $('#momentSearch').addEventListener('input', renderMoments);

        document.addEventListener('click', function (e) {
            var closer = e.target.closest('[data-close-sheet]');
            if (closer) { closeSheet(closer.dataset.closeSheet); return; }
            var backdrop = e.target.closest('.sheet-backdrop');
            if (backdrop && e.target === backdrop && backdrop.id !== 'sheet-search') {
                closeSheet(backdrop.id);
            }
            var emptyBtn = e.target.closest('[data-empty-action]');
            if (emptyBtn) {
                var a = emptyBtn.dataset.emptyAction;
                if (a === 'addPhoto') openAddPhoto();
                else if (a === 'addMemory') openAddMemory();
                else if (a === 'addMoment') openAddMoment();
            }
        });

        $('#photoGrid').addEventListener('click', onPhotoGridClick);
        $('#photoGrid').addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                var tile = e.target.closest('[data-id]');
                if (tile) {
                    e.preventDefault();
                    var idx = state.photos.findIndex(function (p) { return String(p.id) === String(tile.dataset.id); });
                    if (idx >= 0) openViewer(idx);
                }
            }
        });
        $('#timelineList').addEventListener('click', onTimelineClick);
        $('#momentList').addEventListener('click', onMomentClick);
        $('#momentChips').addEventListener('click', onMomentChipClick);
        $('#tab-more').addEventListener('click', onMoreClick);
        $('#tab-more').addEventListener('change', onMoreChange);
        $('#tab-more').addEventListener('input', onMoreInput);
        $('#tab-home').addEventListener('click', onHomeClick);

        $('#profilePickList').addEventListener('click', onProfilePickClick);
        $('#newProfileFromPick').addEventListener('click', goNewProfile);

        $('#memSave').addEventListener('click', saveMemoryHandler);
        $('#photoSave').addEventListener('click', savePhotoHandler);
        $('#momSave').addEventListener('click', saveMomentHandler);
        $('#profSave').addEventListener('click', saveProfileHandler);
        $('#msSave').addEventListener('click', saveMilestoneHandler);

        $('#photoPickImage').addEventListener('click', function () {
            pickFile('file-photo', function (f) {
                processFile(f, 1280, 0.82).then(function (d) {
                    if (!d) return;
                    $('#photoData').value = d;
                    showPhotoPreview('#photoPreview', '#photoPickEmpty', d);
                });
            });
        });
        $('#memPickPhoto').addEventListener('click', function () {
            pickFile('file-memory', function (f) {
                processFile(f, 1200, 0.8).then(function (d) {
                    if (!d) return;
                    $('#memPhotoData').value = d;
                    showPhotoPreview('#memPhotoPreview', '#memPhotoEmpty', d);
                });
            });
        });
        $('#momPickPhoto').addEventListener('click', function () {
            pickFile('file-moment', function (f) {
                processFile(f, 1200, 0.8).then(function (d) {
                    if (!d) return;
                    $('#momPhotoData').value = d;
                    showPhotoPreview('#momPhotoPreview', '#momPhotoEmpty', d);
                });
            });
        });
        $('#p1Pick').addEventListener('click', function () {
            pickFile('file-p1', function (f) {
                processFile(f, 400, 0.82).then(function (d) {
                    if (!d) return;
                    $('#p1Photo').value = d;
                    $('#p1Avatar').innerHTML = '<img src="' + d + '" alt="">';
                });
            });
        });
        $('#p2Pick').addEventListener('click', function () {
            pickFile('file-p2', function (f) {
                processFile(f, 400, 0.82).then(function (d) {
                    if (!d) return;
                    $('#p2Photo').value = d;
                    $('#p2Avatar').innerHTML = '<img src="' + d + '" alt="">';
                });
            });
        });

        $('#momCats').addEventListener('click', function (e) {
            var b = e.target.closest('[data-cat]');
            if (!b) return;
            $('#momCategory').value = b.dataset.cat;
            renderMomentCatChips(b.dataset.cat);
        });

        $('#viewerClose').addEventListener('click', closeViewer);
        $('#viewerDelete').addEventListener('click', function () {
            var p = viewerList[viewerIndex];
            if (!p) return;
            closeViewer();
            deletePhoto(p.id);
        });
        $('#viewerPrev').addEventListener('click', function (e) {
            e.stopPropagation();
            viewerGo(viewerIndex - 1);
        });
        $('#viewerNext').addEventListener('click', function (e) {
            e.stopPropagation();
            viewerGo(viewerIndex + 1);
        });

        var stage = $('.viewer-stage');
        if (stage) {
            stage.addEventListener('click', function (e) {
                if (e.target === stage || e.target.id === 'viewerImg') closeViewer();
            });
            var startX = 0;
            stage.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
            stage.addEventListener('touchend', function (e) {
                var dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 48) viewerGo(viewerIndex + (dx < 0 ? 1 : -1));
            }, { passive: true });
        }

        $('#searchClose').addEventListener('click', closeSearch);
        $('#globalSearch').addEventListener('input', function (e) { searchDebounced(e.target.value); });
        $('#searchChips').addEventListener('click', function (e) {
            var b = e.target.closest('.chip');
            if (!b) return;
            searchFilter = b.dataset.filter;
            $$('#searchChips .chip').forEach(function (c) { c.classList.toggle('active', c === b); });
            runSearch($('#globalSearch').value);
        });
        $('#searchResults').addEventListener('click', onSearchResultClick);

        $('#importCancel').addEventListener('click', function () { $('#importDialog').hidden = true; });
        $('#importOk').addEventListener('click', function () {
            $('#importDialog').hidden = true;
            if (pendingImport) {
                var d = pendingImport;
                pendingImport = null;
                doImport(d);
            }
        });

        $('#file-import').addEventListener('change', function () {
            var f = $('#file-import').files[0];
            if (f) handleImportFile(f);
            $('#file-import').value = '';
        });

        document.addEventListener('keydown', function (e) {
            if (!$('#viewer').hidden) {
                if (e.key === 'Escape') closeViewer();
                else if (e.key === 'ArrowLeft') viewerGo(viewerIndex - 1);
                else if (e.key === 'ArrowRight') viewerGo(viewerIndex + 1);
            }
            if (!$('#sheet-search').hidden && e.key === 'Escape') closeSearch();
        });

        if (window.matchMedia) {
            matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
                if (state.settings.theme === 'system') applyTheme();
            });
        }

        /* Signed-URL images that fail to load (expired URL, transient
           network error) are re-signed and re-rendered automatically. */
        document.addEventListener('error', function (e) {
            var t = e.target;
            if (!t || t.tagName !== 'IMG') return;
            var path = null, store = null;
            var tile = t.closest && t.closest('.photo-tile');
            if (tile && tile.dataset.id) {
                var p = state.photos.find(function (x) { return String(x.id) === String(tile.dataset.id); });
                if (p) { path = p.storagePath; store = 'photos'; }
            }
            var tli = t.closest && t.closest('.timeline-item');
            if (!path && tli && tli.dataset.mid) {
                var m = state.memories.find(function (x) { return String(x.id) === String(tli.dataset.mid); });
                if (m) { path = m.storagePath; store = 'memories'; }
            }
            var mc = t.closest && t.closest('.moment-card');
            if (!path && mc && mc.dataset.mid) {
                var mo = state.moments.find(function (x) { return String(x.id) === String(mc.dataset.mid); });
                if (mo) { path = mo.storagePath; store = 'moments'; }
            }
            var rt = t.closest && t.closest('.recent-thumb');
            if (!path && rt && rt.dataset.id) {
                var kind = rt.dataset.kind;
                var arr = kind === 'photo' ? state.photos : (kind === 'memory' ? state.memories : null);
                var it = arr && arr.find(function (x) { return String(x.id) === String(rt.dataset.id); });
                if (it) { path = it.storagePath; store = kind === 'photo' ? 'photos' : 'memories'; }
            }
            if (!path && t.id === 'viewerImg') {
                var vp = viewerList[viewerIndex];
                if (vp) { path = vp.storagePath; store = 'photos'; }
            }
            if (!path || !store || !window.Sync || !Sync.coupleId || !Sync._refreshSignedUrls) return;
            if (!t.src || t.src.indexOf('http') !== 0) return;
            imgLoadRetries[path] = (imgLoadRetries[path] || 0) + 1;
            if (imgLoadRetries[path] > 2) return;
            if (Sync._signedUrls) delete Sync._signedUrls[path];
            setTimeout(function () {
                try { console.log('[SYNC] img re-sign', store, path); } catch (err) {}
                Sync._refreshSignedUrls();
            }, 600);
        }, true);
    }

    /* =========================================================
       LOAD & INIT
       ========================================================= */
    function loadAll() {
        return Promise.all([Store.listCouples(), Promise.resolve(Store.loadCurrentId()), Promise.resolve(Store.loadSettings())]).then(function (res) {
            state.couples = res[0];
            state.currentProfileId = res[1];
            state.settings = res[2];
            if (state.currentProfileId) {
                return Store.getCouple(state.currentProfileId);
            }
            return null;
        }).then(function (c) {
            state.couple = c;
            if (!state.couple && state.couples.length) {
                state.couple = state.couples[0];
                state.currentProfileId = state.couple.id;
                Store.saveCurrentId(state.currentProfileId);
            }
            return refreshCollections();
        });
    }

    function init() {
        mountIcons();
        bindEvents();
        // Safety net: never let the splash block the UI if init stalls.
        setTimeout(function () {
            var sp = $('#splash');
            if (sp && !sp.classList.contains('hide')) sp.classList.add('hide');
        }, 8000);
        Storage.init().then(function () {
            return migrateLegacy();
        }).then(function () {
            return loadAll();
        }).then(function () {
            return initSync();
        }).then(function () {
            applyTheme();
            resumeSync();
            renderAll();
            showMainOrWelcome();
            if (state.settings.music) Music.start();
            hideLoading();
            Updater.init();
        }).catch(function (e) {
            console.error(e);
            applyTheme();
            renderAll();
            showMainOrWelcome();
            hideLoading();
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    /* =========================================================
       HARDWARE VOLUME KEYS
       The Android activity forwards VOLUME_UP / VOLUME_DOWN here
       so the buttons control the in-app music volume.
       ========================================================= */
    window.TogetherVolume = function (dir) {
        var step = 0.05;
        var v = state.settings.musicVolume != null ? state.settings.musicVolume : 0.7;
        v = clamp(dir === 'up' ? v + step : v - step, 0, 1);
        state.settings.musicVolume = v;
        Music.setVolume(v);
        var slider = $('#musicVolume');
        if (slider) slider.value = Math.round(v * 100);
        var lbl = $('#musicVolValue');
        if (lbl) lbl.textContent = Math.round(v * 100) + '%';
        toast('Volume ' + Math.round(v * 100) + '%');
    };

    /* =========================================================
       IN-APP UPDATES
       The Android app checks the official GitHub release feed
       (see updateConfig.js) for a newer APK. The native bridge
       (window.TogetherUpdate) downloads the APK, verifies its
       SHA-256 digest and signing certificate, then hands it to
       the system installer. Only releases from the configured
       official repository are ever accepted.
       ========================================================= */
    var Updater = {
        cfg: (window.TOGETHER_UPDATE_CONFIG || {}),
        state: 'idle',           // idle|checking|available|downloading|verifying|installing|error
        release: null,
        progress: 0,
        _lastError: null,
        _poll: null,
        _installTimer: null,
        _remindKey: 'together_upd_remind',
        _installedKey: 'together_upd_installed',

        native: function () {
            return !!(window.TogetherUpdate && typeof window.TogetherUpdate.version === 'function');
        },

        currentVersion: function () {
            try {
                if (this.native()) return String(window.TogetherUpdate.version());
            } catch (e) {}
            return this.cfg.webVersion || '1.0';
        },

        fmtTag: function () {
            return 'v' + String(this.release ? this.release.tag : '').replace(/^v/i, '');
        },

        versionCompare: function (a, b) {
            function nums(v) {
                return String(v || '').replace(/^v/i, '').split(/[.\-_]/).map(function (x) {
                    return parseInt(x, 10) || 0;
                });
            }
            var pa = nums(a), pb = nums(b);
            var n = Math.max(pa.length, pb.length);
            for (var i = 0; i < n; i++) {
                var x = pa[i] || 0, y = pb[i] || 0;
                if (x !== y) return x > y ? 1 : -1;
            }
            return 0;
        },

        init: function () {
            if (!this.cfg.enabled) return;
            var self = this;
            window.OnUpdate = function (o) { self.onNative(o); };

            // After an install completes, the installed version matches the
            // marker we wrote before starting the download: greet once.
            var mark = null;
            try { mark = localStorage.getItem(this._installedKey); } catch (e) {}
            if (mark && this.native() && String(mark) === this.currentVersion()) {
                try { localStorage.removeItem(this._installedKey); } catch (e) {}
                toast('Updated to v' + this.currentVersion(), 'success');
            }

            if (this.cfg.checkOnLaunch !== false) {
                setTimeout(function () { self.check(false); }, 3500);
            }
        },

        check: function (manual) {
            if (this.state === 'downloading' || this.state === 'verifying' || this.state === 'installing') return;
            if (!this.native() || !this.cfg.owner || !this.cfg.repo) {
                if (manual) this.setState('error', 'Updates are only available in the Android app.');
                return;
            }
            var self = this;
            this.setState('checking');
            var url = this.cfg.fetchReleaseEndpoint ||
                ('https://api.github.com/repos/' + encodeURIComponent(this.cfg.owner) + '/' + encodeURIComponent(this.cfg.repo) + '/releases/latest');
            httpGet(url)
                .then(function (r) {
                    if (r.status === 404) throw { code: 404 };
                    if (!r.ok) throw new Error('Update server error (' + r.status + ')');
                    return JSON.parse(r.text);
                })
                .then(function (rel) {
                    if (!rel || rel.draft || rel.prerelease || !rel.tag_name) {
                        self.setState('idle');
                        return;
                    }
                    var apk = null, sha = null;
                    (rel.assets || []).forEach(function (a) {
                        if (!a || !a.name) return;
                        if (/\.sha256$/i.test(a.name)) sha = a;
                        else if (!apk && /\.apk$/i.test(a.name)) apk = a;
                    });
                    if (!apk) { self.setState('idle'); return; }
                    if (self.versionCompare(rel.tag_name, self.currentVersion()) <= 0) {
                        self.setState('idle');
                        return;
                    }
                    if (!self.acceptedRelease(rel)) { self.setState('idle'); return; }
                    self.release = {
                        tag: rel.tag_name,
                        name: rel.name || rel.tag_name,
                        body: rel.body || '',
                        apkUrl: apk.browser_download_url,
                        fileName: apk.name,
                        size: apk.size || 0,
                        shaUrl: sha ? sha.browser_download_url : null,
                        sha256: null,
                        published: rel.published_at || ''
                    };
                    if (self.release.shaUrl) {
                        httpGet(self.release.shaUrl).then(function (sr) {
                            if (!sr.ok) return;
                            var m = String(sr.text).match(/[0-9a-fA-F]{64}/);
                            if (m) self.release.sha256 = m[0].toLowerCase();
                        }).catch(function () {});
                    }
                    self.setState('available');
                    if (manual) { self.showDialog(); } else { self.promptIfNew(); }
                })
                .catch(function (e) {
                    if (e && e.code === 404) { self.setState('idle'); return; }
                    self.setState('error', (e && e.message) || 'Could not check for updates');
                });
        },

        /* Only accept releases that come from the configured official repo. */
        acceptedRelease: function (rel) {
            if (!this.cfg.owner || !this.cfg.repo) return true;
            var url = rel.html_url || '';
            return url.indexOf('/' + this.cfg.owner + '/' + this.cfg.repo + '/') !== -1;
        },

        onNative: function (o) {
            if (!o || !o.phase) return;
            var self = this;
            switch (o.phase) {
                case 'downloading':
                    this.setState('downloading', o.progress || 0);
                    break;
                case 'verifying':
                    this.setState('verifying');
                    break;
                case 'installing':
                    this.setState('installing');
                    if (this._installTimer) clearTimeout(this._installTimer);
                    this._installTimer = setTimeout(function () {
                        if (self.state === 'installing') {
                            self.setState('idle');
                            self.hideDialog();
                        }
                    }, 90000);
                    break;
                case 'error':
                    if (this._installTimer) { clearTimeout(this._installTimer); this._installTimer = null; }
                    this.setState('error', o.message || 'Update failed');
                    break;
                case 'idle':
                    if (this._installTimer) { clearTimeout(this._installTimer); this._installTimer = null; }
                    this.setState('idle');
                    break;
            }
        },

        setState: function (s, extra) {
            this.state = s;
            if (s === 'error') this._lastError = extra || this._lastError || 'Update failed';
            if (s === 'downloading') this.progress = extra || 0;
            this.updateBadge();
            this.renderDialog();
        },

        updateBadge: function () {
            var b = $('#updateBtn');
            var dot = $('#updateBadge');
            if (!b) return;
            var show = this.state === 'available';
            b.hidden = !show;
            if (dot) dot.hidden = !show;
        },

        showDialog: function () {
            var d = $('#updateDialog');
            if (!d) return;
            this.renderDialog();
            d.hidden = false;
        },

        hideDialog: function () {
            var d = $('#updateDialog');
            if (d) d.hidden = true;
        },

        renderDialog: function () {
            var title = $('#updateTitle'), ver = $('#updateVersion'),
                notes = $('#updateNotes'), notesBody = $('#updateNotesBody'),
                pw = $('#updateProgressWrap'), pt = $('#updateProgressText'),
                pb = $('#updateProgressBar'), err = $('#updateError'),
                nowBtn = $('#updateNow'), remBtn = $('#updateRemind'),
                iconEl = $('#updateIcon');
            if (!title) return;
            function setIcon(name) { if (iconEl) iconEl.innerHTML = ic(name, 26); }
            var cur = 'Together v' + this.currentVersion();
            switch (this.state) {
                case 'checking':
                    title.textContent = 'Checking for updates';
                    ver.textContent = 'Checking the official release feed…';
                    notes.hidden = true; pw.hidden = true; err.hidden = true;
                    nowBtn.hidden = true; remBtn.hidden = true;
                    setIcon('refresh');
                    break;
                case 'available':
                    title.textContent = 'Update available';
                    ver.textContent = this.fmtTag();
                    if (this.release) {
                        notesBody.innerHTML = esc(this.release.body || 'A newer version of Together is ready.').replace(/\r?\n/g, '<br>');
                    }
                    notes.hidden = false; pw.hidden = true; err.hidden = true;
                    nowBtn.textContent = 'Update now'; nowBtn.hidden = false; nowBtn.disabled = false;
                    remBtn.hidden = false;
                    setIcon('download');
                    break;
                case 'downloading':
                    title.textContent = 'Downloading update';
                    ver.textContent = this.fmtTag() + ' · please keep the app open';
                    notes.hidden = true; err.hidden = true; pw.hidden = false;
                    pb.style.width = this.progress + '%';
                    pt.textContent = 'Downloading ' + Math.round(this.progress) + '%';
                    nowBtn.hidden = true; remBtn.hidden = true;
                    setIcon('download');
                    break;
                case 'verifying':
                    title.textContent = 'Verifying update';
                    ver.textContent = 'Checking the file is intact and signed by Together';
                    notes.hidden = true; err.hidden = true; pw.hidden = false;
                    pb.style.width = '100%';
                    pt.textContent = 'Verifying…';
                    nowBtn.hidden = true; remBtn.hidden = true;
                    setIcon('refresh');
                    break;
                case 'installing':
                    title.textContent = 'Installing';
                    ver.textContent = 'Confirm the install on the next screen';
                    notes.hidden = true; err.hidden = true; pw.hidden = false;
                    pb.style.width = '100%';
                    pt.textContent = 'Installing…';
                    nowBtn.hidden = true; remBtn.hidden = true;
                    setIcon('check');
                    break;
                case 'error':
                    title.textContent = 'Update failed';
                    ver.textContent = 'You can try again in a moment.';
                    notes.hidden = true; pw.hidden = true; err.hidden = false;
                    err.textContent = this._lastError || 'Something went wrong';
                    nowBtn.textContent = 'Try again'; nowBtn.hidden = false; nowBtn.disabled = false;
                    remBtn.hidden = false;
                    setIcon('alert');
                    break;
                default:
                    title.textContent = 'App updates';
                    ver.textContent = cur;
                    notes.hidden = true; pw.hidden = true; err.hidden = true;
                    nowBtn.hidden = true; remBtn.hidden = true;
                    setIcon('refresh');
                    break;
            }
        },

        onUpdateNow: function () {
            this.updateNow();
        },

        updateNow: function () {
            if (this.state === 'downloading' || this.state === 'verifying' || this.state === 'installing') return;
            if (!this.release || !this.native()) { this.check(true); return; }
            var self = this;
            try {
                window.TogetherUpdate.downloadUpdate(
                    this.release.apkUrl,
                    this.release.fileName,
                    this.release.sha256 || ''
                );
            } catch (e) {
                var reason = 'unknown error';
                if (e && e.name && e.message) reason = e.name + ': ' + e.message;
                else if (e && e.message) reason = e.message;
                else if (e) reason = String(e);
                this.setState('error', 'Could not start the download (' + reason + ')');
                return;
            }
            try { localStorage.setItem(this._installedKey, this.release.tag); } catch (e) {}
            this.setState('downloading');
            if (this._poll) clearInterval(this._poll);
            this._poll = setInterval(function () { self.pollState(); }, 600);
        },

        pollState: function () {
            if (!this.native()) return;
            var raw = null;
            try { raw = window.TogetherUpdate.downloadState(); } catch (e) {}
            if (!raw) return;
            try {
                var o = JSON.parse(raw);
                this.onNative(o);
                if (o && (o.phase === 'installing' || o.phase === 'error' || o.phase === 'idle')) {
                    if (this._poll) { clearInterval(this._poll); this._poll = null; }
                }
            } catch (e) {}
        },

        remindLater: function () {
            if (!this.release) { this.hideDialog(); return; }
            try {
                localStorage.setItem(this._remindKey, JSON.stringify({ v: this.release.tag, at: Date.now() }));
            } catch (e) {}
            this.hideDialog();
            toast('We\u2019ll remind you later', 'success');
        },

        shouldPrompt: function () {
            if (!this.release) return true;
            try {
                var raw = localStorage.getItem(this._remindKey);
                if (raw) {
                    var r = JSON.parse(raw);
                    var hours = this.cfg.reminderHours != null ? this.cfg.reminderHours : 24;
                    if (r && r.v === this.release.tag && Date.now() - r.at < hours * 3600000) return false;
                }
            } catch (e) {}
            return true;
        },

        promptIfNew: function () {
            if (this.state === 'available' && this.shouldPrompt()) this.showDialog();
        },

        open: function () {
            if (this.state === 'available') { this.showDialog(); return; }
            this.showDialog();
            this.check(true);
        }
    };

    /* HTTP helper with a fetch -> XHR fallback (older WebViews). */
    function httpGet(url) {
        if (typeof fetch === 'function') {
            return fetch(url, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' })
                .then(function (r) {
                    return r.text().then(function (t) {
                        return { ok: r.ok, status: r.status, text: t };
                    });
                });
        }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Accept', 'application/vnd.github+json');
            xhr.onload = function () {
                resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, text: xhr.responseText || '' });
            };
            xhr.onerror = function () { reject(new Error('Network error')); };
            xhr.send();
        });
    }

    /* =========================================================
       SERVICE WORKER (PWA offline)
       ========================================================= */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./service-worker.js').catch(function () {});
        });
    }
})();
