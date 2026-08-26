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
        plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
        'pen-tool': '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
        eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
        'undo-2': '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/>',
        'redo-2': '<path d="M15 14 20 9l-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
        type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>'
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

    function nowStr() {
        var n = new Date();
        return String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0') + ':' + String(n.getSeconds()).padStart(2, '0');
    }

    function randomMsg(trigger) {
        var MESSAGES = [
            { trigger: 'anniversary', text: 'Your anniversary is almost here!' },
            { trigger: 'anniversary', text: 'Something special is coming up!' },
            { trigger: 'milestone', text: 'A special day is getting closer' },
            { trigger: 'milestone', text: 'You two have something to celebrate!' },
            { trigger: 'days', text: 'Look how far you\'ve come together!' },
            { trigger: 'days', text: 'Every day with you is a celebration' },
            { trigger: 'photos', text: 'Your love story is so beautiful' },
            { trigger: 'chat', text: 'You two never run out of things to say' },
            { trigger: 'generic', text: 'Just a little reminder: you\'re amazing together' },
            { trigger: 'generic', text: 'Your love deserves a celebration' }
        ];
        var msgs = MESSAGES.filter(function (m) { return m.trigger === trigger; });
        return msgs.length ? msgs[Math.floor(Math.random() * msgs.length)].text : '🎉';
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
    var EXPORT_STORES = STORES.filter(function (s) { return s !== 'files'; });
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
            spotifyUrl: '',
            spotifyTrackId: '',
            spotifyTrackName: ''
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
        deleteChat: function (id) {
            addTombstone(state.currentProfileId, 'chat', id);
            if (window.Sync) Sync.pushDelete('chat', id);
            return Storage.del('chat', id).then(function () {
                delete state.chatIds[id];
            });
        },
        deleteChatLocal: function (id) {
            return Storage.del('chat', id).then(function () {
                delete state.chatIds[id];
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
                var chats = (res[5] || []).map(function (m) {
                    var c = Object.assign({}, m);
                    if (c.photo && c.photo.indexOf('data:') === 0) c.photo = '';
                    if (c.photoUrl && !c.storagePath) c.photoUrl = '';
                    return c;
                });
                return {
                    app: 'together',
                    version: 2,
                    exportedAt: new Date().toISOString(),
                    couples: res[0],
                    photos: res[1],
                    memories: res[2],
                    moments: res[3],
                    milestones: res[4],
                    chat: chats,
                    settings: state.settings
                };
            });
        },
        importAll: function (data) {
            if (!data || data.app !== 'together') return Promise.reject(new Error('invalid backup'));
            var clean = function (arr) {
                return (arr || []).map(function (item) {
                    var c = Object.assign({}, item);
                    delete c._synced;
                    return c;
                });
            };
            var jobs = EXPORT_STORES.map(function (s) {
                return Storage.replaceAll(s, clean(data[s]));
            });
            return Promise.all(jobs).then(function () {
                if (Array.isArray(data.chat) && data.chat.length) {
                    return Storage.replaceAll('chat', clean(data.chat));
                }
            }).then(function () {
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
    var REACTION_EMOJIS = ['\u2764\uFE0F', '\uD83D\uDE02', '\uD83D\uDE2E', '\uD83D\uDE22', '\uD83D\uDC4D', '\uD83D\uDD25'];
    var chatReactionTarget = null;
    var chatLongPressTimer = null;
    var chatReplyTo = null;
    var chatLastTap = { time: 0, cid: null };

    function parseEmoji(el) {
        if (!el) return;
        if (typeof twemoji !== 'undefined') {
            twemoji.parse(el, { folder: 'svg', ext: '.svg', base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' });
        }
    }

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
        if (!chatCloudActive()) return 'Offline';
        return state.partnerOnline ? 'Online' : 'Offline';
    }

    function chatStatusAttr() {
        if (chatCloudActive()) return state.partnerOnline ? 'online' : 'offline';
        return 'offline';
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
        var m = {
            id: uid(),
            profileId: String(state.currentProfileId || ''),
            sender: chatSenderId(),
            senderName: chatSenderName(),
            text: text || '',
            kind: photo ? 'image' : 'text',
            photo: photo || null,
            photoUrl: '',
            storagePath: '',
            reactions: {},
            createdAt: Date.now()
        };
        if (chatReplyTo) {
            m.replyTo = chatReplyTo.id;
            m.replyText = (chatReplyTo.text || '').substring(0, 120);
            chatReplyTo = null;
            clearReplyUI();
        }
        return m;
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

    /* ---- Emoji reactions ---- */
    function showEmojiPicker(targetEl) {
        chatReactionTarget = targetEl;
        var picker = $('#emojiPicker');
        if (!picker) return;
        var inner = picker.querySelector('.emoji-picker-inner');
        if (!inner) return;
        inner.innerHTML = REACTION_EMOJIS.map(function (e) {
            return '<button class="emoji-btn" data-emoji="' + esc(e) + '">' + esc(e) + '</button>';
        }).join('');
        parseEmoji(inner);
        picker.hidden = false;
        var rect = targetEl.getBoundingClientRect();
        var content = $('#content');
        var cr = content ? content.getBoundingClientRect() : { top: 0, left: 0 };
        picker.style.bottom = '';
        picker.style.left = Math.max(8, Math.min(rect.left - cr.left, cr.width - 220)) + 'px';
        picker.style.top = (rect.top - cr.top - 48) + 'px';
    }

    function hideEmojiPicker() {
        chatReactionTarget = null;
        var picker = $('#emojiPicker');
        if (picker) picker.hidden = true;
    }

    function toggleReaction(emoji) {
        if (!chatReactionTarget) return;
        var cid = chatReactionTarget.dataset.cid;
        if (!cid) return;
        var msg = state.chats.find(function (x) { return String(x.id) === String(cid); });
        if (!msg) return;
        if (!msg.reactions) msg.reactions = {};
        migrateReactions(msg);
        var uid = chatSenderId();
        if (msg.reactions[uid] === emoji) {
            delete msg.reactions[uid];
        } else {
            msg.reactions[uid] = emoji;
        }
        if (!Object.keys(msg.reactions).length) msg.reactions = null;
        Store.saveChat(msg).then(function () {
            if (chatCloudActive() && window.Sync) Sync.push('chat', msg);
            renderChat();
        });
        hideEmojiPicker();
        hideActionMenu();
    }

    function migrateReactions(msg) {
        if (!msg.reactions || typeof msg.reactions !== 'object') return;
        var keys = Object.keys(msg.reactions);
        if (!keys.length) return;
        if (/^[0-9a-f\-]{20,}$/i.test(keys[0])) return;
        msg.reactions = {};
    }

    function removeReaction(cid) {
        var msg = (state.chats || []).find(function (x) { return String(x.id) === String(cid); });
        if (!msg || !msg.reactions) return;
        migrateReactions(msg);
        var uid = chatSenderId();
        if (!msg.reactions[uid]) return;
        delete msg.reactions[uid];
        if (!Object.keys(msg.reactions).length) msg.reactions = null;
        Store.saveChat(msg).then(function () {
            if (chatCloudActive() && window.Sync) Sync.push('chat', msg);
            renderChat();
        });
    }

    /* ---- Messenger-style action menu (long-press / right-click) ---- */
    var actionMenuTarget = null;

    function showActionMenu(row, originEl) {
        if (!row) return;
        actionMenuTarget = row;
        var menu = $('#chatActionMenu');
        if (!menu) return;

        var reactionsEl = menu.querySelector('#chatActionReactions');
        if (reactionsEl) {
            reactionsEl.innerHTML = REACTION_EMOJIS.map(function (e) {
                return '<button class="chat-action-emoji-btn" data-emoji="' + esc(e) + '">' + esc(e) + '</button>';
            }).join('');
            parseEmoji(reactionsEl);
        }

        menu.hidden = false;

        var rect = row.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var menuW = 220;
        var menuH = 140;

        var left = rect.right + 8;
        var top = rect.top;

        if (left + menuW > vw - 8) left = rect.left - menuW - 8;
        if (left < 8) left = Math.max(8, (vw - menuW) / 2);

        if (top + menuH > vh - 8) top = Math.max(8, vh - menuH - 8);
        if (top < 8) top = 8;

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';

        requestAnimationFrame(function () {
            menu.classList.add('show');
        });
    }

    function hideActionMenu() {
        var menu = $('#chatActionMenu');
        if (menu) {
            menu.classList.remove('show');
            menu.hidden = true;
        }
        actionMenuTarget = null;
    }

    function chatShowActionMenu(e) {
        var row = e.target.closest('.chat-row');
        if (!row) return;
        e.preventDefault();
        showActionMenu(row, e.target);
    }

    function chatLongPressStart(e) {
        var row = e.target.closest('.chat-row');
        if (!row) return;
        chatLongPressTimer = setTimeout(function () {
            chatLongPressTimer = null;
            showActionMenu(row, e.target);
        }, 500);
    }

    function chatLongPressEnd() {
        if (chatLongPressTimer) { clearTimeout(chatLongPressTimer); chatLongPressTimer = null; }
    }

    function actionReply() {
        if (!actionMenuTarget) return;
        var cid = actionMenuTarget.dataset.cid;
        var msg = (state.chats || []).find(function (x) { return String(x.id) === String(cid); });
        if (msg) {
            chatReplyTo = { id: msg.id, text: msg.text || '' };
            showReplyUI(msg);
        }
        hideActionMenu();
    }

    function actionReact(emoji) {
        if (!actionMenuTarget) return;
        var cid = actionMenuTarget.dataset.cid;
        var msg = (state.chats || []).find(function (x) { return String(x.id) === String(cid); });
        if (!msg) return;
        if (!msg.reactions) msg.reactions = {};
        migrateReactions(msg);
        var uid = chatSenderId();
        if (msg.reactions[uid] === emoji) {
            delete msg.reactions[uid];
        } else {
            msg.reactions[uid] = emoji;
        }
        if (!Object.keys(msg.reactions).length) msg.reactions = null;
        Store.saveChat(msg).then(function () {
            if (chatCloudActive() && window.Sync) Sync.push('chat', msg);
            renderChat();
        });
        hideActionMenu();
    }

    function deleteChoiceDialog(opts) {
        return new Promise(function (resolve) {
            var dlg = $('#deleteChoiceDialog');
            if (!dlg) { resolve(null); return; }
            $('#deleteChoiceTitle').textContent = opts.title || 'Delete message?';
            $('#deleteChoiceText').textContent = opts.text || '';
            $('#deleteChoiceIcon').innerHTML = ic(opts.icon || 'trash', 26);
            var unsendBtn = $('#deleteChoiceUnsend');
            var forYouBtn = $('#deleteChoiceForYou');
            var cancelBtn = $('#deleteChoiceCancel');

            function done(v) {
                dlg.hidden = true;
                unsendBtn.removeEventListener('click', onUnsend);
                forYouBtn.removeEventListener('click', onForYou);
                cancelBtn.removeEventListener('click', onCancel);
                dlg.removeEventListener('click', onBackdrop);
                resolve(v);
            }
            function onUnsend() { done('unsend'); }
            function onForYou() { done('forYou'); }
            function onCancel() { done(null); }
            function onBackdrop(e) { if (e.target === dlg) done(null); }

            unsendBtn.addEventListener('click', onUnsend);
            forYouBtn.addEventListener('click', onForYou);
            cancelBtn.addEventListener('click', onCancel);
            dlg.addEventListener('click', onBackdrop);
            dlg.hidden = false;
        });
    }

    function actionDelete() {
        if (!actionMenuTarget) return;
        var cid = actionMenuTarget.dataset.cid;
        var msg = (state.chats || []).find(function (x) { return String(x.id) === String(cid); });
        hideActionMenu();
        if (!msg) return;
        deleteChoiceDialog({
            title: 'Delete this message?',
            text: 'Remove it from just your device, or unsend it from both.',
            icon: 'trash'
        }).then(function (choice) {
            if (!choice) return;
            if (choice === 'unsend') {
                Store.deleteChat(msg.id).then(function () {
                    renderChat();
                    toast('Message unsent', 'success');
                });
            } else if (choice === 'forYou') {
                Store.deleteChatLocal(msg.id).then(function () {
                    renderChat();
                    toast('Deleted for you', 'success');
                });
            }
        });
    }

    function chatBadgeTap(e) {
        var badge = e.target.closest('.chat-reaction-badge');
        if (!badge) return;
        var cid = badge.dataset.cid;
        var emoji = badge.dataset.emoji;
        if (!cid) return;
        var now = Date.now();
        if (chatLastTap.cid === cid && now - chatLastTap.time < 400) {
            chatLastTap = { time: 0, cid: null };
            e.preventDefault();
            e.stopPropagation();
            var msg = (state.chats || []).find(function (x) { return String(x.id) === String(cid); });
            if (msg && msg.reactions) {
                migrateReactions(msg);
                var uid = chatSenderId();
                if (msg.reactions[uid] === emoji) {
                    delete msg.reactions[uid];
                    if (!Object.keys(msg.reactions).length) msg.reactions = null;
                    Store.saveChat(msg).then(function () {
                        if (chatCloudActive() && window.Sync) Sync.push('chat', msg);
                        renderChat();
                    });
                }
            }
            return;
        }
        chatLastTap = { time: now, cid: cid };
    }

    /* ---- Swipe-to-reply ---- */
    var swipeState = null;

    function chatSwipeStart(e) {
        var touch = e.touches[0];
        var row = e.target.closest('.chat-row');
        if (!row || e.target.closest('.chat-reactions') || e.target.closest('.chat-bubble img')) return;
        swipeState = { startX: touch.clientX, startY: touch.clientY, cid: row.dataset.cid, el: row, swiping: false, dx: 0 };
    }

    function chatSwipeMove(e) {
        if (!swipeState) return;
        var touch = e.touches[0];
        var dx = touch.clientX - swipeState.startX;
        var dy = touch.clientY - swipeState.startY;
        var isMine = swipeState.el.classList.contains('mine');
        if (!swipeState.swiping) {
            if (Math.abs(dx) < 15) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                if ((isMine && dx < 0) || (!isMine && dx > 0)) {
                    swipeState.swiping = true;
                } else { swipeState = null; return; }
            } else { swipeState = null; return; }
        }
        e.preventDefault();
        swipeState.dx = isMine ? Math.min(0, dx) : Math.max(0, dx);
        swipeState.el.style.transform = 'translateX(' + swipeState.dx + 'px)';
        swipeState.el.style.transition = 'none';
    }

    function chatSwipeEnd() {
        if (!swipeState || !swipeState.swiping) { swipeState = null; return; }
        var s = swipeState;
        swipeState = null;
        s.el.style.transition = 'transform 0.2s ease-out';
        if (Math.abs(s.dx) > 80) {
            var msg = (state.chats || []).find(function (x) { return String(x.id) === String(s.cid); });
            if (msg) {
                chatReplyTo = { id: msg.id, text: msg.text || '' };
                showReplyUI(msg);
            }
        }
        s.el.style.transform = '';
    }

    function showReplyUI(msg) {
        var bar = $('#chatReplyContext');
        var txt = $('#chatReplyInfoText');
        if (bar) bar.hidden = false;
        if (txt) txt.textContent = (msg.senderName || '') + ': ' + (msg.text || '').substring(0, 60);
        var input = $('#chatInput');
        if (input) input.focus();
    }

    function clearReplyUI() {
        chatReplyTo = null;
        var bar = $('#chatReplyContext');
        if (bar) bar.hidden = true;
    }

    function chatBubbleHTML(m) {
        var mine = String(m.sender) === chatSenderId();
        var img = (m.photo && m.photo.indexOf('data:') === 0) ? m.photo : (m.photoUrl || '');
        var body = '';
        if (m.replyTo && m.replyText) {
            var replySender = '';
            if (state.chats) {
                var orig = state.chats.find(function (x) { return String(x.id) === String(m.replyTo); });
                if (orig) replySender = orig.senderName || '';
            }
            body += '<div class="chat-reply-quote" data-reply-to="' + esc(m.replyTo) + '"><span class="chat-reply-name">' + esc(replySender) + '</span>' + esc(m.replyText) + '</div>';
        }
        if (img) body += '<img class="chat-img" src="' + esc(img) + '" alt="Photo" loading="lazy">';
        if (m.text) body += esc(m.text);
        var reactions = m.reactions || {};
        var rHtml = '';
        var rKeys = Object.keys(reactions);
        if (rKeys.length) {
            var myId = chatSenderId();
            var seen = {};
            rHtml = '<div class="chat-reactions">';
            for (var ri = 0; ri < rKeys.length; ri++) {
                var rEmoji = reactions[rKeys[ri]];
                if (!rEmoji || seen[rEmoji]) continue;
                seen[rEmoji] = true;
                var isMine = rKeys[ri] === myId;
                rHtml += '<span class="chat-reaction-badge' + (isMine ? ' mine' : '') + '" data-cid="' + esc(m.id) + '" data-emoji="' + esc(rEmoji) + '">' +
                    esc(rEmoji) + '</span>';
            }
            rHtml += '</div>';
        }
        var time = '';
        try {
            time = new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } catch (e) {}
        return '<div class="chat-row' + (mine ? ' mine' : '') + '" data-cid="' + esc(m.id) + '">' +
            '<div class="chat-bubble">' + body + '</div>' + rHtml +
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
        parseEmoji(list);
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
        var spotId = state.settings.spotifyTrackId || '';
        var spotName = state.settings.spotifyTrackName || '';
        var hasSpot = !!spotUrl;
        var spotEmbed = hasSpot ? spotifyEmbedUrl(spotId || parseSpotifyId(spotUrl)) : '';

        var spotSection = '';
        if (hasSpot && spotEmbed) {
            spotSection =
                '<div class="list-item" style="margin-top:8px"><span class="ic spotify-ic">' + ic('spotify', 20) + '</span>' +
                '<div class="list-item-main"><div class="list-item-label">Our song</div>' +
                '<div class="list-item-sub">' + esc(spotName || 'Tap to play in Spotify') + '</div></div>' +
                '<button class="btn btn-ghost btn-sm" id="musicSpotifyPlay" type="button">Open</button>' +
                '<button class="icon-btn danger" id="musicSpotifyRemove" type="button" aria-label="Remove Spotify link">' + ic('trash', 18) + '</button></div>' +
                '<div class="music-panel"><div class="spotify-embed-wrap">' +
                '<iframe class="spotify-embed" src="' + esc(spotEmbed) + '" frameBorder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>' +
                '</div></div>';
        } else {
            spotSection =
                '<div class="list-item" style="margin-top:8px"><span class="ic spotify-ic">' + ic('spotify', 20) + '</span>' +
                '<div class="list-item-main"><div class="list-item-label">Spotify</div>' +
                '<div class="list-item-sub">Open Spotify to listen together</div></div>' +
                '<button class="btn btn-ghost btn-sm" id="musicSpotifyOpen" type="button">Open</button></div>';
        }

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
            spotSection +
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
        var partnerJoined = state.partnerJoined || (c && c.member2 && c.member2.joined) || (c && c.person2 && c.person2.name);
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
                '<div class="list-item-sub" id="partnerSub">' + (partnerJoined ? esc(partnerName) + ' · ' + (state.partnerOnline ? 'Online' : 'Offline') : 'Waiting for partner to join') + '</div></div></div>';
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
        if (tab === 'live') LiveCanvas.activate();
        else LiveCanvas.deactivate();
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
                if (!state.partnerName) {
                    var pN = (c.person2 && c.person2.name) || '';
                    if (pN) { state.partnerName = pN; state.partnerJoined = true; }
                }
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
        return !!(window.Sync && Sync.ready && Sync.authed);
    }

    function waitForAuth(timeoutMs) {
        timeoutMs = timeoutMs || 20000;
        if (syncUsable()) return Promise.resolve(true);
        if (!window.Sync || !Sync.ready) return Promise.resolve(false);
        return new Promise(function (resolve) {
            var elapsed = 0;
            var iv = setInterval(function () {
                elapsed += 300;
                if (Sync.authed) { clearInterval(iv); resolve(true); }
                else if (elapsed >= timeoutMs) { clearInterval(iv); resolve(false); }
            }, 300);
        });
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
        setCreateBusy(true);
        waitForAuth(20000).then(function (ready) {
            if (!ready || !syncUsable()) {
                setCreateBusy(false);
                var errMsg = (window.Sync && Sync._lastError) ? Sync._lastError : '';
                console.log('[Together] Create couple failed. Sync ready:', Sync.ready, 'authed:', Sync.authed, 'status:', Sync.status, 'error:', errMsg);
                var detail = '';
                if (Sync.status === 'failed') detail = '\n\nError: ' + (errMsg || 'unknown');
                else if (!Sync.ready) detail = '\n\nSupabase client not configured.';
                else detail = '\n\nSync status: ' + (Sync.status || 'unknown');
                toast('Could not connect to server.' + detail + '\n\nCheck: 1) Internet is on 2) Supabase Dashboard > Auth > Providers > Anonymous is enabled 3) SQL schema has been applied.', 'error');
                return;
            }
            return Sync.createCouple({ yourName: n1, partnerName: n2, startDate: start }).then(function (res) {
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
        setJoinBusy(true);
        waitForAuth(20000).then(function (ready) {
            if (!ready || !syncUsable()) {
                setJoinBusy(false);
                var je2 = $('#w-join-error');
                je2.textContent = 'Could not connect to server. Check your internet connection and try again.';
                je2.hidden = false;
                return;
            }
            var name = ($('#w-join-name').value || '').trim();
            return Sync.joinCouple(code, { yourName: name }).then(function (res) {
                var doc = res.couple || {};
                var members = doc.members || {};
                var meta = doc.meta || {};
                var m1 = members.member1 || {};
                var m2 = members.member2 || {};
                var partnerId = m1.id || '';
                var fetchPartnerName = partnerId ? Sync.client.from('profiles').select('display_name').eq('id', partnerId).maybeSingle().then(function (pRes) {
                    return (!pRes.error && pRes.data) ? (pRes.data.display_name || '').trim() : '';
                }).catch(function () { return ''; }) : Promise.resolve('');
                return fetchPartnerName.then(function (realPartnerName) {
                    var pName = realPartnerName || m1.name || '';
                    var couple = {
                        id: res.coupleId,
                        person1: { name: pName || 'Person 1', photo: m1.photo || null, memberId: m1.id || '' },
                        person2: { name: m2.name || pName || (name || 'Partner'), photo: m2.photo || null, memberId: m2.id || Sync.memberId },
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
                        state.partnerName = pName;
                        renderAll();
                        $('#w-connected-text').textContent = pName ? ('You and ' + pName + ' are now sharing this couple space.') : 'You are now sharing your partner\'s couple space.';
                        showWelcomePage('w-connected-page');
                    });
                });
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
        var selfId = Sync.memberId || '';
        var m1Id = (couple.person1 && couple.person1.memberId) || (couple.member1 && couple.member1.id) || '';
        var m2Id = (couple.person2 && couple.person2.memberId) || (couple.member2 && couple.member2.id) || '';
        var partnerIsM2 = String(m1Id) === String(selfId) ? true : (String(m2Id) === String(selfId) ? false : true);
        var partnerPerson = partnerIsM2 ? (couple.person2 || {}) : (couple.person1 || {});
        var partnerMember = partnerIsM2 ? (couple.member2 || {}) : (couple.member1 || {});
        state.partnerJoined = !!(partnerMember.id) || state.partnerJoined;
        state.partnerName = partnerPerson.name || partnerMember.name || state.partnerName || '';
        state.partnerOnline = !!partnerPerson.online;
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
            chatSetStatus(state.chatStatus || 'online');
            if (currentTab === 'more') renderMore();
        };
        Sync.onCelebration = function (celebration) {
            if (celebration && celebration.message) {
                SurpriseSystem.show(celebration.message, celebration.trigger_type || 'sync', celebration.id);
            }
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
        waitForAuth(20000).then(function (ready) {
            if (!ready || !syncUsable()) { toast('Could not connect to server. Check your internet connection.', 'error'); return; }
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
        }).catch(function () {
            toast('Could not connect to server. Check your internet connection.', 'error');
        });
    }

    /* =========================================================
       MEMORIES (timeline)
       ========================================================= */
    var _saveBusy = {};

    function openAddMemory() {
        $('#sheetMemoryTitle').textContent = 'Add Memory';
        $('#memEditId').value = '';
        $('#memTitle').value = '';
        $('#memDate').value = todayISO();
        $('#memDesc').value = '';
        $('#memPhotoData').value = '';
        hidePhotoPreview('#memPhotoPreview', '#memPhotoEmpty');
        setSaveBusy('#memSave', false);
        _saveBusy.mem = false;
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
        setSaveBusy('#memSave', false);
        _saveBusy.mem = false;
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
                setSaveBusy('#memSave', false);
                _saveBusy.mem = false;
                closeSheet('sheet-memory');
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast(existing ? 'Memory updated' : 'Memory saved', 'success');
            }).catch(function () {
                setSaveBusy('#memSave', false);
                _saveBusy.mem = false;
                toast('Unable to save memory. Please try again.', 'error');
            });
        };
        if (_saveBusy.mem) return;
        var hasNewPhoto = newImg && newImg.indexOf('data:') === 0 && (!existing || newImg !== existing.photo);
        if (canUploadPhoto() && hasNewPhoto) {
            _saveBusy.mem = true;
            setSaveBusy('#memSave', true);
            uploadPhotoBase64(newImg, 'memories', rec.id).then(function (r) {
                rec.photo = newImg;
                rec.photoUrl = r.photoUrl;
                rec.storagePath = r.storagePath;
                if (existing && existing.storagePath && existing.storagePath !== r.storagePath) {
                    if (window.Sync && Sync.removeFile) Sync.removeFile(existing.storagePath);
                }
                doSave();
            }).catch(function (e) {
                console.warn('Memory photo upload failed, saving locally:', e);
                rec.photo = newImg;
                rec.photoUrl = '';
                rec.storagePath = '';
                doSave();
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
        setSaveBusy('#momSave', false);
        _saveBusy.mom = false;
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
        setSaveBusy('#momSave', false);
        _saveBusy.mom = false;
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
                setSaveBusy('#momSave', false);
                _saveBusy.mom = false;
                closeSheet('sheet-moment');
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast(existing ? 'Moment updated' : 'Moment saved', 'success');
            }).catch(function () {
                setSaveBusy('#momSave', false);
                _saveBusy.mom = false;
                toast('Unable to save moment. Please try again.', 'error');
            });
        };
        if (_saveBusy.mom) return;
        var hasNewPhoto = newImg && newImg.indexOf('data:') === 0 && (!existing || newImg !== existing.photo);
        if (canUploadPhoto() && hasNewPhoto) {
            _saveBusy.mom = true;
            setSaveBusy('#momSave', true);
            uploadPhotoBase64(newImg, 'moments', rec.id).then(function (r) {
                rec.photo = newImg;
                rec.photoUrl = r.photoUrl;
                rec.storagePath = r.storagePath;
                if (existing && existing.storagePath && existing.storagePath !== r.storagePath) {
                    if (window.Sync && Sync.removeFile) Sync.removeFile(existing.storagePath);
                }
                doSave();
            }).catch(function (e) {
                console.warn('Moment photo upload failed, saving locally:', e);
                rec.photo = newImg;
                rec.photoUrl = '';
                rec.storagePath = '';
                doSave();
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
        setSaveBusy('#photoSave', false);
        _saveBusy.photo = false;
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
                setSaveBusy('#photoSave', false);
                _saveBusy.photo = false;
                closeSheet('sheet-photo');
                return refreshCollections();
            }).then(function () {
                renderAll();
                toast('Photo saved', 'success');
            }).catch(function () {
                setSaveBusy('#photoSave', false);
                _saveBusy.photo = false;
                toast('Unable to save photo. Please try again.', 'error');
            });
        };
        if (_saveBusy.photo) return;
        if (canUploadPhoto()) {
            _saveBusy.photo = true;
            setSaveBusy('#photoSave', true);
            uploadPhotoBase64(data, 'photos', rec.id).then(function (r) {
                rec.data = data;
                rec.photoUrl = r.photoUrl;
                rec.storagePath = r.storagePath;
                doSave();
            }).catch(function (e) {
                console.warn('Photo upload failed, saving locally:', e);
                rec.data = data;
                doSave();
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
       LIVE CANVAS (shared couple wallpaper)
       Real-time via Supabase Broadcast + DB persistence
       ========================================================= */
    var LiveCanvas = (function () {
        var canvas, ctx;
        var strokes = [];
        var redoStack = [];
        var currentStroke = null;
        var drawing = false;
        var tool = 'pen';
        var color = '#262626';
        var brushSize = 3;
        var eraserSize = 20;
        var partnerTimer = null;
        var dbSaveTimer = null;
        var dirty = false;
        var canvasVersion = 0;
        var supaChannel = null;
        var activated = false;
        var textMode = false;

        var LS_CANVAS = 'together_live_canvas';
        var LS_CANVAS_VER = 'together_live_canvas_ver';

        function saveLocal() {
            try { localStorage.setItem(LS_CANVAS, JSON.stringify(strokes)); } catch (e) {}
            try { localStorage.setItem(LS_CANVAS_VER, String(canvasVersion)); } catch (e) {}
        }
        function loadLocal() {
            try {
                var s = localStorage.getItem(LS_CANVAS);
                if (s) {
                    strokes = JSON.parse(s);
                    canvasVersion = parseInt(localStorage.getItem(LS_CANVAS_VER) || '0', 10) || 0;
                }
            } catch (e) {}
        }

        function init() {
            canvas = $('#liveCanvas');
            if (!canvas) return;
            ctx = canvas.getContext('2d');
            loadLocal();
            resizeCanvas();
            bindCanvasEvents();
            bindToolbarEvents();
            window.addEventListener('resize', resizeCanvas);
        }

        function resizeCanvas() {
            if (!canvas || !ctx) return;
            var wrap = canvas.parentElement;
            if (!wrap) return;
            var rect = wrap.getBoundingClientRect();
            var dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            redraw();
        }

        function getPos(e) {
            var rect = canvas.getBoundingClientRect();
            var t = e.touches ? e.touches[0] : e;
            return { x: t.clientX - rect.left, y: t.clientY - rect.top };
        }

        function bindCanvasEvents() {
            canvas.addEventListener('mousedown', onStart);
            canvas.addEventListener('mousemove', onMove);
            canvas.addEventListener('mouseup', onEnd);
            canvas.addEventListener('mouseleave', onEnd);
            canvas.addEventListener('touchstart', function (e) { e.preventDefault(); onStart(e); }, { passive: false });
            canvas.addEventListener('touchmove', function (e) { e.preventDefault(); onMove(e); }, { passive: false });
            canvas.addEventListener('touchend', function (e) { e.preventDefault(); onEnd(e); }, { passive: false });
            canvas.addEventListener('touchcancel', onEnd);
        }

        function onStart(e) {
            if (textMode) return;
            drawing = true;
            var p = getPos(e);
            var isEraser = tool === 'eraser';
            currentStroke = {
                type: isEraser ? 'eraser' : 'pen',
                color: isEraser ? 'eraser' : color,
                size: isEraser ? eraserSize : brushSize,
                points: [p]
            };
            broadcast({ action: 'drawing_start' });
        }

        function onMove(e) {
            if (!drawing || !currentStroke) return;
            var p = getPos(e);
            currentStroke.points.push(p);
            drawSegment(currentStroke, currentStroke.points.length - 2, currentStroke.points.length - 1);
        }

        function onEnd() {
            if (!drawing || !currentStroke) return;
            drawing = false;
            if (currentStroke.points.length > 0) {
                strokes.push(currentStroke);
                redoStack = [];
                dirty = true;
                scheduleDbSave();
                updatePlaceholder();
                broadcast({ action: 'stroke', stroke: currentStroke });
            }
            currentStroke = null;
            broadcast({ action: 'drawing_end' });
        }

        function drawSegment(stroke, from, to) {
            if (!ctx || from < 0 || to >= stroke.points.length) return;
            var p1 = stroke.points[from];
            var p2 = stroke.points[to];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            if (stroke.type === 'eraser') {
                ctx.globalCompositeOperation = 'source-over';
                var bg = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#ffffff';
                ctx.strokeStyle = bg;
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = stroke.color;
            }
            ctx.lineWidth = stroke.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        }

        function redraw() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#ffffff';
            ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
            var erasers = [];
            for (var i = 0; i < strokes.length; i++) {
                var s = strokes[i];
                if (s.type === 'eraser') { erasers.push(s); continue; }
                if (s.type === 'text') {
                    drawTextStroke(s);
                } else if (s.type === 'remote') {
                    drawSegment(s, 0, 0);
                } else {
                    for (var j = 1; j < s.points.length; j++) {
                        drawSegment(s, j - 1, j);
                    }
                }
            }
            for (var k = 0; k < erasers.length; k++) {
                var e = erasers[k];
                for (var m = 1; m < e.points.length; m++) {
                    drawSegment(e, m - 1, m);
                }
            }
        }

        function drawTextStroke(s) {
            if (!ctx) return;
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = s.color;
            ctx.font = (s.size || 16) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(s.text, s.x, s.y);
        }

        function undo() {
            if (strokes.length === 0) return;
            var removed = strokes.pop();
            redoStack.push(removed);
            dirty = true;
            scheduleDbSave();
            redraw();
            updatePlaceholder();
            broadcast({ action: 'undo' });
        }

        function redo() {
            if (redoStack.length === 0) return;
            var s = redoStack.pop();
            strokes.push(s);
            dirty = true;
            scheduleDbSave();
            redraw();
            updatePlaceholder();
            broadcast({ action: 'redo', stroke: s });
        }

        function clearCanvas() {
            strokes = [];
            redoStack = [];
            dirty = true;
            scheduleDbSave();
            saveLocal();
            redraw();
            updatePlaceholder();
            broadcast({ action: 'clear' });
        }

        function updatePlaceholder() {
            var ph = $('#livePlaceholder');
            if (ph) ph.classList.toggle('hidden', strokes.length > 0);
        }

        /* ---- Broadcast (instant peer-to-peer) ---- */
        function broadcast(msg) {
            if (!supaChannel) return;
            msg.sender = Sync.memberId || '';
            try {
                supaChannel.send({ type: 'broadcast', event: 'canvas', payload: msg });
            } catch (e) { /* ignore */ }
        }

        function onBroadcastReceive(payload) {
            var msg = payload.payload;
            if (!msg || msg.sender === Sync.memberId) return;

            if (msg.action === 'stroke' && msg.stroke) {
                strokes.push(msg.stroke);
                redoStack = [];
                for (var i = 1; i < msg.stroke.points.length; i++) {
                    drawSegment(msg.stroke, i - 1, i);
                }
                updatePlaceholder();
                scheduleDbSave();
            } else if (msg.action === 'drawing_start') {
                showPartnerDrawing();
            } else if (msg.action === 'drawing_end') {
                hidePartnerDrawing();
            } else if (msg.action === 'undo') {
                if (strokes.length > 0) {
                    strokes.pop();
                    redraw();
                    updatePlaceholder();
                    scheduleDbSave();
                }
            } else if (msg.action === 'redo' && msg.stroke) {
                strokes.push(msg.stroke);
                redraw();
                updatePlaceholder();
                scheduleDbSave();
            } else if (msg.action === 'clear') {
                strokes = [];
                redoStack = [];
                redraw();
                updatePlaceholder();
                scheduleDbSave();
            } else if (msg.action === 'text' && msg.stroke) {
                strokes.push(msg.stroke);
                redoStack = [];
                drawTextStroke(msg.stroke);
                updatePlaceholder();
                scheduleDbSave();
            }
        }

        /* ---- DB persistence (batched) ---- */
        function scheduleDbSave() {
            if (dbSaveTimer) clearTimeout(dbSaveTimer);
            dbSaveTimer = setTimeout(saveToDb, 3000);
            saveLocal();
        }

        function saveToDb() {
            if (!dirty || !Sync.coupleId) return;
            dirty = false;
            var data = {
                strokes: JSON.stringify(strokes),
                version: canvasVersion + 1,
                updated_by: Sync.memberId || null,
                updated_at: new Date().toISOString()
            };
            var q;
            if (canvasVersion === 0) {
                data.couple_id = Sync.coupleId;
                q = Sync.client.from('live_canvas').insert(data);
            } else {
                q = Sync.client.from('live_canvas').update({
                    strokes: data.strokes,
                    version: data.version,
                    updated_by: data.updated_by,
                    updated_at: data.updated_at
                }).eq('couple_id', Sync.coupleId);
            }
            q.then(function (res) {
                if (res.error && res.error.code === '23505') {
                    Sync.client.from('live_canvas').update({
                        strokes: data.strokes,
                        version: data.version,
                        updated_by: data.updated_by,
                        updated_at: data.updated_at
                    }).eq('couple_id', Sync.coupleId).then(function (r2) {
                        if (!r2.error) canvasVersion = data.version;
                    });
                } else if (!res.error) {
                    canvasVersion = data.version;
                }
            });
        }

        function loadFromDb() {
            if (!Sync.coupleId) return;
            Sync.client.from('live_canvas').select('*').eq('couple_id', Sync.coupleId).single().then(function (res) {
                if (res.error || !res.data) {
                    canvasVersion = 0;
                    return;
                }
                canvasVersion = res.data.version || 0;
                try {
                    var remoteStrokes = typeof res.data.strokes === 'string' ? JSON.parse(res.data.strokes) : (res.data.strokes || []);
                    if (remoteStrokes.length > strokes.length) {
                        strokes = remoteStrokes;
                        redoStack = [];
                        saveLocal();
                    }
                } catch (e) {}
                redraw();
                updatePlaceholder();
                updateTimestamp();
            });
        }

        /* ---- Channel setup ---- */
        function subscribeRealtime() {
            if (supaChannel || !Sync.coupleId) return;
            supaChannel = Sync.client.channel('live-canvas-' + Sync.coupleId);

            supaChannel.on('broadcast', { event: 'canvas' }, function (payload) {
                onBroadcastReceive(payload);
            });

            supaChannel.on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'live_canvas',
                filter: 'couple_id=eq.' + Sync.coupleId
            }, function (payload) {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    var row = payload.new;
                    if (!row) return;
                    if (row.updated_by && Sync.memberId && String(row.updated_by) === String(Sync.memberId)) return;
                    canvasVersion = row.version || canvasVersion;
                    try {
                        var incoming = typeof row.strokes === 'string' ? JSON.parse(row.strokes) : (row.strokes || []);
                        if (incoming.length > strokes.length) {
                            strokes = incoming;
                            redoStack = [];
                            redraw();
                            updatePlaceholder();
                        }
                    } catch (e) {}
                } else if (payload.eventType === 'DELETE') {
                    strokes = [];
                    redoStack = [];
                    canvasVersion = 0;
                    redraw();
                    updatePlaceholder();
                }
            });

            supaChannel.subscribe(function (status) {
                dbg('LIVE CANVAS channel:', status);
            });
        }

        function unsubscribeRealtime() {
            if (supaChannel) {
                Sync.client.removeChannel(supaChannel);
                supaChannel = null;
            }
        }

        function showPartnerDrawing() {
            var el = $('#livePartnerStatus');
            if (el) el.hidden = false;
            if (partnerTimer) clearTimeout(partnerTimer);
            partnerTimer = setTimeout(hidePartnerDrawing, 4000);
        }

        function hidePartnerDrawing() {
            var el = $('#livePartnerStatus');
            if (el) el.hidden = true;
        }

        function updateTimestamp() {
            var el = $('#liveUpdated');
            if (!el) return;
            el.textContent = 'Updated just now';
        }

        function bindToolbarEvents() {
            var toolbar = $('#liveToolbar');
            if (!toolbar) return;
            toolbar.addEventListener('click', function (e) {
                var btn = e.target.closest('.live-tool');
                if (!btn) return;
                var t = btn.dataset.tool;
                if (t) {
                    tool = t;
                    toolbar.querySelectorAll('.live-tool[data-tool]').forEach(function (b) {
                        b.classList.toggle('active', b.dataset.tool === t);
                    });
                    textMode = (t === 'text');
                    if (textMode) showTextInput();
                    else hideTextInput();
                    return;
                }
                if (btn.id === 'liveUndo') { undo(); return; }
                if (btn.id === 'liveRedo') { redo(); return; }
                if (btn.id === 'liveClear') { showClearDialog(); return; }
                if (btn.id === 'liveWallpaper') { setLockWallpaper(); return; }
                if (btn.id === 'liveDownload') { downloadWallpaper(); return; }
            });

            var colorsEl = $('#liveColors');
            if (colorsEl) {
                colorsEl.addEventListener('click', function (e) {
                    var c = e.target.closest('.live-color');
                    if (!c) return;
                    color = c.dataset.color;
                    colorsEl.querySelectorAll('.live-color').forEach(function (b) {
                        b.classList.toggle('active', b === c);
                    });
                });
            }

            var sizeEl = $('#liveSize');
            if (sizeEl) {
                sizeEl.addEventListener('input', function () {
                    brushSize = parseInt(this.value, 10) || 3;
                });
            }

            var textConfirm = $('#liveTextConfirm');
            if (textConfirm) textConfirm.addEventListener('click', confirmText);
            var textCancel = $('#liveTextCancel');
            if (textCancel) textCancel.addEventListener('click', hideTextInput);
            var textInput = $('#liveTextInput');
            if (textInput) {
                textInput.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') confirmText();
                    if (e.key === 'Escape') hideTextInput();
                });
            }
        }

        function showTextInput() {
            var wrap = $('#liveTextInputWrap');
            if (wrap) wrap.hidden = false;
            var input = $('#liveTextInput');
            if (input) { input.value = ''; input.focus(); }
        }

        function hideTextInput() {
            var wrap = $('#liveTextInputWrap');
            if (wrap) wrap.hidden = true;
            textMode = false;
        }

        function confirmText() {
            var input = $('#liveTextInput');
            if (!input) return;
            var txt = (input.value || '').trim();
            if (!txt) return;
            var rect = canvas.getBoundingClientRect();
            var stroke = {
                type: 'text',
                text: txt,
                color: color,
                size: Math.max(14, brushSize * 4),
                x: rect.width / 2 - txt.length * 4,
                y: rect.height / 2
            };
            strokes.push(stroke);
            redoStack = [];
            dirty = true;
            scheduleDbSave();
            redraw();
            updatePlaceholder();
            broadcast({ action: 'text', stroke: stroke });
            hideTextInput();
        }

        function captureWallpaperBase64() {
            if (!canvas || strokes.length === 0) return null;
            var dpr = window.devicePixelRatio || 1;
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            var offscreen = document.createElement('canvas');
            offscreen.width = 1080;
            offscreen.height = 1920;
            var octx = offscreen.getContext('2d');
            var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
            octx.fillStyle = bg;
            octx.fillRect(0, 0, 1080, 1920);
            var scale = Math.min(1080 / w, 1920 / h);
            var ox = (1080 - w * scale) / 2;
            var oy = (1920 - h * scale) / 2;
            octx.translate(ox, oy);
            octx.scale(scale, scale);
            for (var i = 0; i < strokes.length; i++) {
                var s = strokes[i];
                if (s.type === 'text') {
                    octx.globalCompositeOperation = 'source-over';
                    octx.fillStyle = s.color;
                    octx.font = (s.size || 16) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
                    octx.textBaseline = 'top';
                    octx.fillText(s.text, s.x, s.y);
                } else {
                    for (var j = 1; j < s.points.length; j++) {
                        var p1 = s.points[j - 1];
                        var p2 = s.points[j];
                        octx.beginPath();
                        octx.moveTo(p1.x, p1.y);
                        octx.lineTo(p2.x, p2.y);
                        if (s.type === 'eraser') {
                            octx.globalCompositeOperation = 'source-over';
                            octx.strokeStyle = bg;
                        } else {
                            octx.globalCompositeOperation = 'source-over';
                            octx.strokeStyle = s.color;
                        }
                        octx.lineWidth = s.size;
                        octx.lineCap = 'round';
                        octx.lineJoin = 'round';
                        octx.stroke();
                    }
                }
            }
            octx.globalCompositeOperation = 'source-over';
            return offscreen.toDataURL('image/jpeg', 0.92);
        }

        function setLockWallpaper() {
            if (strokes.length === 0) {
                toast('Draw something first!', 'error');
                return;
            }
            var b64 = captureWallpaperBase64();
            if (!b64) return;
            var raw = b64.replace(/^data:image\/\w+;base64,/, '');
            if (window.Together && window.Together.setWallpaper) {
                window.Together.setWallpaper(raw);
            } else {
                downloadWallpaper();
            }
        }

        function downloadWallpaper() {
            if (strokes.length === 0) {
                toast('Draw something first!', 'error');
                return;
            }
            var b64 = captureWallpaperBase64();
            if (!b64) return;
            var link = document.createElement('a');
            link.download = 'together-wallpaper.jpg';
            link.href = b64;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast('Wallpaper downloaded!', 'success');
        }

        function showClearDialog() {
            var existing = $('#dialog-clear-canvas');
            if (existing) existing.remove();
            var bd = document.createElement('div');
            bd.className = 'dialog-backdrop';
            bd.id = 'dialog-clear-canvas';
            bd.innerHTML =
                '<div class="dialog">' +
                '<div class="dialog-icon soft"><span class="ic" data-icon="trash" data-size="28"></span></div>' +
                '<h3>Clear Canvas?</h3>' +
                '<p>This will erase the entire shared canvas. Your partner will also see it cleared.</p>' +
                '<div class="dialog-actions">' +
                '<button class="btn btn-ghost" id="dialogClearCancel">Cancel</button>' +
                '<button class="btn btn-danger" id="dialogClearConfirm">Clear</button>' +
                '</div></div>';
            document.body.appendChild(bd);
            mountIcons(bd);
            bd.querySelector('#dialogClearCancel').addEventListener('click', function () { bd.remove(); });
            bd.querySelector('#dialogClearConfirm').addEventListener('click', function () {
                bd.remove();
                clearCanvas();
                toast('Canvas cleared', 'success');
            });
            bd.addEventListener('click', function (e) { if (e.target === bd) bd.remove(); });
        }

        function activate() {
            if (activated) return;
            activated = true;
            if (!canvas) init();
            loadLocal();
            redraw();
            updatePlaceholder();
            resizeCanvas();
            if (Sync.coupleId) {
                loadFromDb();
                subscribeRealtime();
            }
            var wpBtn = $('#liveWallpaper');
            var dlBtn = $('#liveDownload');
            if (window.Together && window.Together.setWallpaper) {
                if (wpBtn) wpBtn.style.display = '';
                if (dlBtn) dlBtn.style.display = 'none';
            } else {
                if (wpBtn) wpBtn.style.display = 'none';
                if (dlBtn) dlBtn.style.display = '';
            }
        }

        function deactivate() {
            if (!activated) return;
            activated = false;
            if (dirty) saveToDb();
        }

        return {
            init: init,
            activate: activate,
            deactivate: deactivate,
            loadFromDb: loadFromDb
        };
    })();

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
       Single instance, lifecycle-safe.
       ========================================================= */
    var Music = {
        ctx: null,
        master: null,
        filter: null,
        timer: null,
        audio: null,
        objUrl: null,
        playing: false,
        _starting: false,
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
            if (this.playing || this._starting) return;
            this._starting = true;
            var src = this.source();
            this.playing = true;
            this._starting = false;
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
                this._clearTimer();
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
            if (!this.audio) this.audio = new Audio();
            this.audio.loop = true;
            this.audio.volume = this.volume();
            this.audio.preload = 'auto';
            this.audio.src = src;
            this.audio.play().catch(function () {
                self.playing = false;
                toast('Could not play that audio source.', 'error');
            });
        },
        _clearTimer: function () {
            if (this.timer) { clearInterval(this.timer); this.timer = null; }
        },
        stop: function () {
            this.playing = false;
            this._starting = false;
            this._clearTimer();
            if (this.audio) {
                try { this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); } catch (e) {}
                this.audio = null;
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
        pause: function () {
            if (!this.playing) return;
            this._clearTimer();
            if (this.audio) {
                try { this.audio.pause(); } catch (e) {}
            }
            if (this.ctx && this.master) {
                try {
                    var now = this.ctx.currentTime;
                    this.master.gain.cancelScheduledValues(now);
                    this.master.gain.linearRampToValueAtTime(0.0001, now + 0.3);
                } catch (e) {}
            }
        },
        resume: function () {
            if (!state.settings.music) return;
            if (this.playing) {
                var src = this.source();
                if (src.kind === 'ambient' && this.ctx && this.master) {
                    try {
                        var mood = this.mood();
                        var now = this.ctx.currentTime;
                        this.master.gain.cancelScheduledValues(now);
                        this.master.gain.setValueAtTime(0.0001, now);
                        this.master.gain.linearRampToValueAtTime(mood.base * (0.4 + 0.6 * this.volume()), now + 1.0);
                        this._clearTimer();
                        var self = this;
                        this.playChord();
                        this.timer = setInterval(function () { self.playChord(); }, mood.speed);
                    } catch (e) {}
                } else if (this.audio) {
                    try { this.audio.play(); } catch (e) {}
                }
            }
        },
        restart: function () {
            this.stop();
            if (state.settings.music) this.start();
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
        var W = 1080, H = 1920;
        var canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        var ctx = canvas.getContext('2d');

        /* --- base fill --- */
        ctx.fillStyle = '#1a0a14';
        ctx.fillRect(0, 0, W, H);

        /* --- mesh gradient: overlapping radial blobs for depth --- */
        function radBlob(cx, cy, r, color) {
            var rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            rg.addColorStop(0, color);
            rg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rg;
            ctx.fillRect(0, 0, W, H);
        }

        radBlob(W * 0.5, H * 0.08, H * 0.55, 'rgba(255,140,160,0.55)');
        radBlob(W * 0.15, H * 0.25, H * 0.5, 'rgba(200,90,140,0.45)');
        radBlob(W * 0.85, H * 0.18, H * 0.45, 'rgba(255,180,130,0.35)');
        radBlob(W * 0.5, H * 0.45, H * 0.55, 'rgba(180,70,130,0.4)');
        radBlob(W * 0.75, H * 0.55, H * 0.5, 'rgba(160,60,160,0.35)');
        radBlob(W * 0.2, H * 0.7, H * 0.55, 'rgba(140,50,180,0.4)');
        radBlob(W * 0.6, H * 0.85, H * 0.5, 'rgba(100,30,160,0.45)');
        radBlob(W * 0.1, H * 0.95, H * 0.4, 'rgba(80,20,140,0.3)');

        /* --- warm highlight orb (top right) --- */
        radBlob(W * 0.75, H * 0.12, H * 0.3, 'rgba(255,200,170,0.25)');

        /* --- cool accent orb (bottom left) --- */
        radBlob(W * 0.25, H * 0.88, H * 0.35, 'rgba(120,40,200,0.2)');

        /* --- soft aurora streaks --- */
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        var ag = ctx.createLinearGradient(0, H * 0.3, W, H * 0.5);
        ag.addColorStop(0, 'rgba(255,130,160,0)');
        ag.addColorStop(0.3, 'rgba(255,160,140,0.08)');
        ag.addColorStop(0.6, 'rgba(200,100,180,0.06)');
        ag.addColorStop(1, 'rgba(140,80,200,0)');
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.moveTo(0, H * 0.25);
        ctx.bezierCurveTo(W * 0.3, H * 0.32, W * 0.6, H * 0.38, W, H * 0.35);
        ctx.lineTo(W, H * 0.55);
        ctx.bezierCurveTo(W * 0.7, H * 0.52, W * 0.35, H * 0.48, 0, H * 0.52);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        /* --- fine film grain --- */
        var imgData = ctx.getImageData(0, 0, W, H);
        var d = imgData.data;
        for (var pi = 0; pi < d.length; pi += 8) {
            var noise = (Math.random() - 0.5) * 14;
            d[pi] = Math.min(255, Math.max(0, d[pi] + noise));
            d[pi + 1] = Math.min(255, Math.max(0, d[pi + 1] + noise));
            d[pi + 2] = Math.min(255, Math.max(0, d[pi + 2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);

        /* --- bokeh orbs with glow --- */
        var bokehData = [
            [0.15, 0.12, 60, 0.04], [0.78, 0.08, 80, 0.035], [0.45, 0.22, 50, 0.03],
            [0.88, 0.35, 40, 0.045], [0.1, 0.45, 55, 0.03], [0.65, 0.48, 70, 0.025],
            [0.3, 0.62, 45, 0.04], [0.82, 0.7, 60, 0.03], [0.5, 0.8, 50, 0.035],
            [0.2, 0.88, 35, 0.04], [0.7, 0.92, 45, 0.03], [0.92, 0.15, 30, 0.05],
            [0.05, 0.3, 35, 0.04], [0.55, 0.05, 40, 0.03], [0.35, 0.75, 55, 0.025]
        ];
        for (var bi = 0; bi < bokehData.length; bi++) {
            var bd = bokehData[bi];
            var bx = bd[0] * W + (Math.random() - 0.5) * 40;
            var by = bd[1] * H + (Math.random() - 0.5) * 40;
            var br = bd[2] + Math.random() * 20;
            var bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
            bg.addColorStop(0, 'rgba(255,255,255,' + bd[3] + ')');
            bg.addColorStop(0.5, 'rgba(255,255,255,' + (bd[3] * 0.4) + ')');
            bg.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
        }

        /* --- soft vignette --- */
        var vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);

        /* --- draw a heart shape --- */
        function drawHeart(cx, cy, size) {
            ctx.beginPath();
            var s = size;
            ctx.moveTo(cx, cy + s * 0.35);
            ctx.bezierCurveTo(cx, cy - s * 0.1, cx - s * 0.55, cy - s * 0.45, cx - s * 0.55, cy - s * 0.15);
            ctx.bezierCurveTo(cx - s * 0.55, cy + s * 0.15, cx, cy + s * 0.5, cx, cy + s * 0.7);
            ctx.bezierCurveTo(cx, cy + s * 0.5, cx + s * 0.55, cy + s * 0.15, cx + s * 0.55, cy - s * 0.15);
            ctx.bezierCurveTo(cx + s * 0.55, cy - s * 0.45, cx, cy - s * 0.1, cx, cy + s * 0.35);
            ctx.closePath();
        }

        /* large outlined heart */
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 3;
        drawHeart(W / 2, 310, 180);
        ctx.stroke();

        /* small solid heart */
        drawHeart(W / 2, 295, 48);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();

        /* --- names --- */
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = '600 78px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(esc((c.person1 && c.person1.name) || 'You'), W / 2, 500);

        ctx.font = '300 42px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('and', W / 2, 570);

        ctx.font = '600 78px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(esc((c.person2 && c.person2.name) || 'Partner'), W / 2, 660);

        /* --- thin line divider --- */
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 160, 730);
        ctx.lineTo(W / 2 + 160, 730);
        ctx.stroke();

        /* small diamond on the line */
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.save();
        ctx.translate(W / 2, 730);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-5, -5, 10, 10);
        ctx.restore();

        /* --- together since + date --- */
        var y = 830;
        if (c.startDate) {
            ctx.font = '500 24px -apple-system, "Helvetica Neue", Arial, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.letterSpacing = '6px';
            ctx.fillText('TOGETHER SINCE', W / 2, y);
            ctx.letterSpacing = '0px';
            y += 56;
            ctx.font = '300 52px -apple-system, "Helvetica Neue", Arial, sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(fmtDateLong(c.startDate), W / 2, y);
            y += 90;
        }

        /* --- days count --- */
        if (dur && dur.totalDays > 0) {
            ctx.font = '200 96px -apple-system, "Helvetica Neue", Arial, sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(dur.totalDays.toLocaleString(), W / 2, y);
            y += 40;
            ctx.font = '400 22px -apple-system, "Helvetica Neue", Arial, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(dur.totalDays === 1 ? 'DAY TOGETHER' : 'DAYS TOGETHER', W / 2, y);
            y += 80;
        }

        /* --- thin line divider 2 --- */
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 120, y);
        ctx.lineTo(W / 2 + 120, y);
        ctx.stroke();
        y += 60;

        /* --- stats row --- */
        ctx.font = '400 24px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        var s1 = state.memories.length + ' memories';
        var s2 = state.photos.length + ' photos';
        var s3 = state.moments.length + ' moments';
        var dot = '   ·   ';
        ctx.fillText(s1 + dot + s2 + dot + s3, W / 2, y);
        y += 50;

        /* --- secondary stats row (optional: chat, milestones) --- */
        var chatCount = (state.chat || []).length;
        var msCount = (state.milestones || []).length;
        if (chatCount > 0 || msCount > 0) {
            var parts = [];
            if (chatCount > 0) parts.push(chatCount + ' messages');
            if (msCount > 0) parts.push(msCount + ' milestones');
            ctx.font = '300 20px -apple-system, "Helvetica Neue", Arial, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.fillText(parts.join(dot), W / 2, y);
            y += 50;
        }

        /* --- watermark --- */
        ctx.font = '300 18px -apple-system, "Helvetica Neue", Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillText('made with together', W / 2, H - 120);

        /* --- store blob for sharing --- */
        window._storyCanvas = canvas;
        window._storyBlob = null;
        canvas.toBlob(function (blob) { window._storyBlob = blob; }, 'image/png');

        var preview = $('#storyCardPreview');
        if (preview) preview.src = canvas.toDataURL('image/png');
        openSheet('sheet-story-share');
    }

    window.downloadStoryCard = function downloadStoryCard() {
        var blob = window._storyBlob;
        if (!blob) { toast('Card not ready', 'error'); return; }
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'together-story.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        toast('Story card saved', 'success');
    };

    window.copyStoryCard = function copyStoryCard() {
        var blob = window._storyBlob;
        if (!blob) { toast('Card not ready', 'error'); return; }
        if (navigator.clipboard && navigator.clipboard.write) {
            var item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(function () {
                toast('Image copied to clipboard', 'success');
            }).catch(function () {
                window.downloadStoryCard();
            });
        } else {
            window.downloadStoryCard();
        }
    };

    window.shareStoryNative = function shareStoryNative() {
        var blob = window._storyBlob;
        if (!blob) { toast('Card not ready', 'error'); return; }
        var c = state.couple;
        if (navigator.share) {
            var file = new File([blob], 'together-story.png', { type: 'image/png' });
            var data = { title: 'Our Story' };
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                data.files = [file];
                data.text = 'Made with Together \u2764\ufe0f';
            } else {
                data.text = 'Made with Together \u2764\ufe0f\n' + ((c.person1 && c.person1.name) || '') + ' & ' + ((c.person2 && c.person2.name) || '');
            }
            navigator.share(data).catch(function () {});
        } else {
            window.copyStoryCard();
        }
        closeSheet('sheet-story-share');
    };

    window.shareStoryFacebook = function shareStoryFacebook() {
        var blob = window._storyBlob;
        if (!blob) { toast('Card not ready', 'error'); return; }
        if (navigator.share) {
            var file = new File([blob], 'together-story.png', { type: 'image/png' });
            var data = { title: 'Our Story', files: [file], text: 'Made with Together \u2764\ufe0f' };
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share(data).catch(function () {
                    window.open('https://www.facebook.com/stories/create', '_blank');
                });
            } else {
                window.open('https://www.facebook.com/stories/create', '_blank');
            }
        } else {
            window.open('https://www.facebook.com/stories/create', '_blank');
        }
        closeSheet('sheet-story-share');
        toast('Save the image, then post to Facebook Stories', 'success');
    };

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
                var chatCount = Array.isArray(data.chat) ? data.chat.length : 0;
                $('#importText').textContent = 'Backup contains:\n\nProfiles: ' + (data.couples || []).length +
                    '\nPhotos: ' + (data.photos || []).length +
                    '\nMemories: ' + (data.memories || []).length +
                    '\nMoments: ' + (data.moments || []).length +
                    '\nMilestones: ' + (data.milestones || []).length +
                    (chatCount ? '\nChat messages: ' + chatCount : '') +
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
        if (data.version > 2) throw new Error('incompatible');
        return true;
    }

    function doImport(data) {
        Store.importAll(data).then(function () {
            return Store.listCouples();
        }).then(function (couples) {
            state.couples = couples;
            if (couples.length) {
                var first = (data.couples && data.couples.length) ? data.couples[0].id : couples[0].id;
                var importedCouple = couples.find(function (x) { return String(x.id) === String(first); });
                if (importedCouple) {
                    var pName = (importedCouple.person2 && importedCouple.person2.name) || '';
                    if (pName) { state.partnerName = pName; state.partnerJoined = true; }
                }
                var code = importedCouple && importedCouple.coupleCode;
                if (code && window.Sync && Sync.ready && Sync.authed) {
                    var selfName = (importedCouple.person1 && importedCouple.person1.name) || 'Person 1';
                    return Sync.joinCouple(code, { yourName: selfName }).then(function () {
                        return setCurrentProfile(first);
                    }).catch(function () {
                        return setCurrentProfile(first);
                    });
                }
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
        }).catch(function (e) {
            console.error('Import failed:', e);
            toast('Restore failed. The backup file may be corrupted or incompatible.', 'error');
        });
    }

    function clearAllData() {
        confirmDialog({
            title: 'Delete all data?',
            text: 'This will permanently delete all photos, memories, moments, milestones, chat messages, and uploaded files from both devices and the cloud. This cannot be undone.',
            confirmText: 'Delete Everything',
            icon: 'alert'
        }).then(function (ok) {
            if (!ok) return;
            var syncDelete = (window.Sync && Sync.ready && Sync.authed) ? Sync.deleteAllData() : Promise.resolve();
            syncDelete.then(function () {
                return Store.clearAll();
            }).then(function () {
                try {
                    localStorage.removeItem('together_live_canvas');
                    localStorage.removeItem('together_live_canvas_ver');
                } catch (e) {}
                state.couple = null;
                state.couples = [];
                state.currentProfileId = null;
                state.photos = [];
                state.memories = [];
                state.moments = [];
                state.milestones = [];
                state.chats = [];
                state.chatIds = {};
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
        if (id === 'musicSpotifyOpen') { window.openSpotifyApp(); return; }
        if (id === 'musicSpotifyPlay') { window.playSpotifySong(); return; }
        if (id === 'musicSpotifyRemove') { clearSpotifySong(); return; }

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

    function parseSpotifyId(url) {
        if (!url) return '';
        var m = url.match(/open\.spotify\.com\/(track|album|playlist|show)\/([a-zA-Z0-9]+)/);
        if (m) return m[1] + ':' + m[2];
        m = url.match(/spotify:(track|album|playlist|show):([a-zA-Z0-9]+)/);
        if (m) return m[1] + ':' + m[2];
        return '';
    }

    function spotifyEmbedUrl(id) {
        if (!id) return '';
        return 'https://open.spotify.com/embed/' + id + '?utm_source=generator&theme=0';
    }

    function spotifyDeepLink(url, id) {
        if (id) return 'spotify:' + id;
        return url;
    }

    function clearSpotifySong() {
        state.settings.spotifyUrl = '';
        state.settings.spotifyTrackId = '';
        state.settings.spotifyTrackName = '';
        Store.saveSettings(state.settings);
        renderMore();
        toast('Spotify link removed', 'success');
    }

    function saveSpotifyUrl() {
        var url = ($('#musicSpotifyInput').value || '').trim();
        if (!url || !/^(https?:\/\/open\.spotify\.com\/|spotify:)/i.test(url)) { toast('Enter a valid Spotify link', 'error'); return; }
        state.settings.spotifyUrl = url;
        var parsedId = parseSpotifyId(url);
        state.settings.spotifyTrackId = parsedId;
        state.settings.spotifyTrackName = '';
        Store.saveSettings(state.settings);
        renderMore();
        toast('Spotify song saved', 'success');
    }

    window.playSpotifySong = function () {
        var url = state.settings.spotifyUrl;
        var id = state.settings.spotifyTrackId;
        var deepLink = spotifyDeepLink(url, id);
        openExternal(deepLink);
    };

    window.openSpotifyApp = function () {
        openExternal('spotify:');
    };

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
        $('#w-import-btn').addEventListener('click', function () { $('#file-import').click(); });
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
        $('#chatReplyClear').addEventListener('click', clearReplyUI);

        $('#chatList').addEventListener('contextmenu', chatShowActionMenu);
        $('#chatList').addEventListener('touchstart', chatLongPressStart, { passive: true });
        $('#chatList').addEventListener('touchend', chatLongPressEnd);
        $('#chatList').addEventListener('touchcancel', chatLongPressEnd);
        $('#chatList').addEventListener('touchmove', chatLongPressEnd);
        $('#chatList').addEventListener('touchstart', chatBadgeTap, { passive: false });
        $('#chatList').addEventListener('touchstart', chatSwipeStart, { passive: true });
        $('#chatList').addEventListener('touchmove', chatSwipeMove, { passive: false });
        $('#chatList').addEventListener('touchend', chatSwipeEnd);

        $('#emojiPicker').addEventListener('click', function (e) {
            var btn = e.target.closest('.emoji-btn');
            if (btn) toggleReaction(btn.dataset.emoji);
        });
        document.addEventListener('click', function (e) {
            if (!$('#emojiPicker').hidden && !e.target.closest('.emoji-picker') && !e.target.closest('.chat-row')) {
                hideEmojiPicker();
            }
            if (!$('#chatActionMenu').hidden && !e.target.closest('.chat-action-menu') && !e.target.closest('.chat-row')) {
                hideActionMenu();
            }
        });

        var chatActionMenu = $('#chatActionMenu');
        if (chatActionMenu) {
            chatActionMenu.addEventListener('click', function (e) {
                var emojiBtn = e.target.closest('.chat-action-emoji-btn');
                if (emojiBtn) { actionReact(emojiBtn.dataset.emoji); return; }
                var replyBtn = e.target.closest('#chatActionReply');
                if (replyBtn) { actionReply(); return; }
                var deleteBtn = e.target.closest('#chatActionDelete');
                if (deleteBtn) { actionDelete(); return; }
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { hideActionMenu(); hideEmojiPicker(); }
        });

        $('#chatList').addEventListener('click', function (e) {
            var quote = e.target.closest('.chat-reply-quote');
            if (!quote) return;
            var replyToId = quote.dataset.replyTo;
            if (!replyToId) return;
            e.preventDefault();
            e.stopPropagation();
            var targetRow = document.querySelector('.chat-row[data-cid="' + replyToId + '"]');
            if (!targetRow) return;
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetRow.classList.remove('reply-highlight');
            void targetRow.offsetWidth;
            targetRow.classList.add('reply-highlight');
            setTimeout(function () { targetRow.classList.remove('reply-highlight'); }, 1000);
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

    /* =========================================================
       COUPLE SURPRISE SYSTEM
       Automatically detects meaningful moments and shows
       a cute teddy bear celebration popup.
       ========================================================= */
    var SurpriseSystem = (function () {
        var STORAGE_KEY = 'together_surprise_log';
        var MIN_GAP_MS = 5 * 24 * 60 * 60 * 1000;
        var showing = false;
        var ringtoneAudio = null;
        var currentCelebrationId = null;
        var ringtoneRetryCleanups = [];

        var MESSAGES = [
            { trigger: 'anniversary', text: 'Your anniversary is almost here!' },
            { trigger: 'anniversary', text: 'Something special is coming up!' },
            { trigger: 'milestone', text: 'A special day is getting closer' },
            { trigger: 'milestone', text: 'You two have something to celebrate!' },
            { trigger: 'days', text: 'Look how far you\'ve come together!' },
            { trigger: 'days', text: 'Every day with you is a celebration' },
            { trigger: 'photos', text: 'Your love story is so beautiful' },
            { trigger: 'chat', text: 'You two never run out of things to say' },
            { trigger: 'generic', text: 'Just a little reminder: you\'re amazing together' },
            { trigger: 'generic', text: 'Your love deserves a celebration' }
        ];

        function getLog() {
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
            catch (e) { return {}; }
        }

        function saveLog(log) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)); }
            catch (e) { /* ignore */ }
        }

        function lastShown(type) {
            var log = getLog();
            return log[type] || 0;
        }

        function markShown(type) {
            var log = getLog();
            log[type] = Date.now();
            var keys = Object.keys(log);
            if (keys.length > 20) {
                keys.sort(function (a, b) { return log[a] - log[b]; });
                for (var i = 0; i < keys.length - 10; i++) delete log[keys[i]];
            }
            saveLog(log);
        }

        function canShow(type) {
            return Date.now() - lastShown(type) > MIN_GAP_MS;
        }

        function check() {
            if (showing) return;
            if (!state.couple || !state.couple.startDate) return;
            var dur = computeDuration(state.couple.startDate);
            if (dur.totalDays < 1) return;

            var ms = upcomingMilestones(state.couple.startDate, state.milestones);
            var candidates = [];

            if (ms.anniversary && ms.anniversary.remaining >= 0 && ms.anniversary.remaining <= 7) {
                candidates.push({ type: 'anniversary_' + ms.anniversary.remaining, trigger: 'anniversary', priority: ms.anniversary.remaining <= 2 ? 10 : 5 });
            }

            if (ms.next && ms.next.remaining >= 0 && ms.next.remaining <= 7) {
                candidates.push({ type: 'milestone_' + ms.next.iso, trigger: 'milestone', priority: ms.next.remaining <= 2 ? 8 : 4 });
            }

            var specialDays = [50, 100, 200, 300, 365, 500, 730, 1000, 1500, 2000, 2500, 3000, 3650];
            for (var i = 0; i < specialDays.length; i++) {
                var diff = Math.abs(dur.totalDays - specialDays[i]);
                if (diff <= 2) {
                    candidates.push({ type: 'days_' + specialDays[i], trigger: 'days', priority: diff === 0 ? 12 : 6 });
                }
            }

            if (state.photos && state.photos.length === 100 && canShow('photos_100')) {
                candidates.push({ type: 'photos_100', trigger: 'photos', priority: 3 });
            }
            if (state.photos && state.photos.length === 500 && canShow('photos_500')) {
                candidates.push({ type: 'photos_500', trigger: 'photos', priority: 3 });
            }

            if (state.chats && state.chats.length === 500 && canShow('chat_500')) {
                candidates.push({ type: 'chat_500', trigger: 'chat', priority: 2 });
            }
            if (state.chats && state.chats.length === 1000 && canShow('chat_1000')) {
                candidates.push({ type: 'chat_1000', trigger: 'chat', priority: 2 });
            }

            if (candidates.length === 0 && canShow('generic') && dur.totalDays > 0 && dur.totalDays % 30 === 0) {
                candidates.push({ type: 'generic_' + dur.totalDays, trigger: 'generic', priority: 1 });
            }

            if (!candidates.length) return;
            candidates = candidates.filter(function (c) { return canShow(c.type); });
            if (!candidates.length) return;
            candidates.sort(function (a, b) { return b.priority - a.priority; });
            var pick = candidates[0];
            var msgs = MESSAGES.filter(function (m) { return m.trigger === pick.trigger; });
            var msg = msgs[Math.floor(Math.random() * msgs.length)] || MESSAGES[MESSAGES.length - 1];
            if (window.Sync && Sync.ready && Sync.authed && Sync.coupleId && Sync.publishCelebration) {
                Sync.publishCelebration({ triggerType: pick.type, message: msg.text }).then(function (ok) {
                    if (ok) { markShown(pick.type); }
                    else { show(msg.text, pick.type); }
                });
            } else {
                show(msg.text, pick.type);
            }
        }

        function show(message, type, celebrationId) {
            if (showing) return;
            showing = true;
            currentCelebrationId = celebrationId || null;
            markShown(type);
            var overlay = $('#surpriseOverlay');
            var msgEl = $('#surpriseMessage');
            var particles = $('#surpriseParticles');
            if (!overlay || !msgEl) { showing = false; return; }
            msgEl.textContent = message;
            overlay.hidden = false;
            if (window.Music && Music.playing) Music.pause();
            playRingtone();
            spawnParticles(particles);
            overlay.onclick = function () { hide(); };
        }

        function hide() {
            var overlay = $('#surpriseOverlay');
            if (overlay) { overlay.hidden = true; overlay.onclick = null; }
            showing = false;
            var cid = currentCelebrationId;
            currentCelebrationId = null;
            stopRingtone();
            if (window.Music && state.settings.music) Music.resume();
            if (cid && window.Sync && Sync.ackCelebration) Sync.ackCelebration(cid);
        }

        function playRingtone() {
            stopRingtone();
            try {
                ringtoneAudio = new Audio('cute.mp3');
                ringtoneAudio.volume = 0.8;
                ringtoneAudio.preload = 'auto';
                ringtoneAudio.play().catch(function () {
                    var onClick = function () {
                        if (ringtoneAudio) ringtoneAudio.play().catch(function () {});
                        cleanup();
                    };
                    var cleanup = function () {
                        document.removeEventListener('click', onClick);
                        document.removeEventListener('touchstart', onClick);
                        ringtoneRetryCleanups = ringtoneRetryCleanups.filter(function (fn) { return fn !== cleanup; });
                    };
                    ringtoneRetryCleanups.push(cleanup);
                    document.addEventListener('click', onClick);
                    document.addEventListener('touchstart', onClick);
                });
            } catch (e) { /* audio not available */ }
        }

        function stopRingtone() {
            ringtoneRetryCleanups.forEach(function (fn) { fn(); });
            ringtoneRetryCleanups = [];
            if (ringtoneAudio) {
                try { ringtoneAudio.pause(); ringtoneAudio.currentTime = 0; } catch (e) {}
                ringtoneAudio = null;
            }
        }

        function spawnParticles(container) {
            if (!container) return;
            container.innerHTML = '';
            var emojis = ['\u2764\uFE0F', '\uD83D\uDC95', '\uD83D\uDC96', '\u2728', '\uD83C\uDF80', '\uD83D\uDC9D'];
            var colors = ['#e1306c', '#fd1d1d', '#fcb045', '#833ab4', '#ff6b6b', '#ffb6c1'];
            for (var i = 0; i < 18; i++) {
                var p = document.createElement('div');
                p.className = 'surprise-particle';
                var isHeart = i < 8;
                if (isHeart) {
                    p.classList.add('heart');
                    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                } else if (i < 14) {
                    p.classList.add('sparkle');
                    p.style.background = colors[Math.floor(Math.random() * colors.length)];
                    p.style.boxShadow = '0 0 6px ' + p.style.background;
                } else {
                    p.classList.add('confetti');
                    p.style.background = colors[Math.floor(Math.random() * colors.length)];
                }
                p.style.left = (10 + Math.random() * 80) + '%';
                p.style.top = (50 + Math.random() * 40) + '%';
                p.style.animationDelay = (Math.random() * 1.5) + 's';
                p.style.animationDuration = (2 + Math.random() * 2) + 's';
                container.appendChild(p);
            }
        }

        function testShow(trigger) {
            var msgs = MESSAGES.filter(function (m) { return m.trigger === trigger; });
            var msg = msgs.length ? msgs[Math.floor(Math.random() * msgs.length)] : MESSAGES[0];
            show(msg.text, 'dev_' + trigger);
        }

        return { check: check, show: show, markShown: markShown, getLog: getLog, testShow: testShow };
    })();

    function init() {
        mountIcons();
        LiveCanvas.init();
        bindEvents();
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                if (window.Music && Music.playing) Music.pause();
            } else if (document.visibilityState === 'visible') {
                if (window.Music && state.settings.music && !window.SurpriseSystem) Music.resume();
                else if (window.Music && state.settings.music) {
                    var overlay = $('#surpriseOverlay');
                    if (!overlay || overlay.hidden) Music.resume();
                }
            }
        });
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
            setTimeout(function () { SurpriseSystem.check(); }, 3000);
            if (window.Sync && Sync.ready && Sync.authed && Sync.coupleId && Sync.fetchPendingCelebrations) {
                Sync.fetchPendingCelebrations().then(function (rows) {
                    if (rows && rows.length) {
                        var c = rows[0];
                        if (c && c.message) {
                            SurpriseSystem.show(c.message, c.trigger_type || 'sync', c.id);
                        }
                    }
                });
            }
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
