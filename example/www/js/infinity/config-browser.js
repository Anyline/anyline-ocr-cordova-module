// www/js/infinity/config-browser.js
// Renders the group tab bar and config chip row.
// Calls back to main.js via window._onConfigTap, window._onEditSaveAs, window._onDeleteUserConfig.

(function () {
    let _containerEl = null;
    let _groupBarEl = null;
    let _chipRowEl = null;
    let _contextMenuEl = null;

    let _configsByGroup = {};
    let _activeGroupIndex = 0;
    let _menuConfig = null;
    let _longPressTimer = null;
    let _touchStartX = 0;
    let _touchStartY = 0;

    // ─── Init ─────────────────────────────────────────────────────────────────

    function init(containerEl) {
        _containerEl = containerEl;

        _containerEl.innerHTML =
            '<div id="cb-group-bar"></div>' +
            '<div id="cb-chip-row"></div>' +
            '<div id="cb-context-menu" style="display:none">' +
            '  <div id="cb-menu-backdrop"></div>' +
            '  <div id="cb-menu-sheet">' +
            '    <div id="cb-menu-title"></div>' +
            '    <button id="cb-menu-edit" class="cb-menu-item">Edit / Save as</button>' +
            '    <button id="cb-menu-delete" class="cb-menu-item cb-menu-destructive" style="display:none">Delete</button>' +
            '    <button id="cb-menu-cancel" class="cb-menu-item cb-menu-cancel-btn">Cancel</button>' +
            '  </div>' +
            '</div>';

        _groupBarEl = document.getElementById('cb-group-bar');
        _chipRowEl = document.getElementById('cb-chip-row');
        _contextMenuEl = document.getElementById('cb-context-menu');

        document.getElementById('cb-menu-backdrop').addEventListener('click', _closeMenu);
        document.getElementById('cb-menu-cancel').addEventListener('click', _closeMenu);
        document.getElementById('cb-menu-edit').addEventListener('click', function () {
            const c = _menuConfig;
            _closeMenu();
            if (c && window._onEditSaveAs) { window._onEditSaveAs(c); }
        });
        document.getElementById('cb-menu-delete').addEventListener('click', function () {
            const c = _menuConfig;
            _closeMenu();
            if (c && window._onDeleteUserConfig) { window._onDeleteUserConfig(c); }
        });
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    function render(configsByGroup, activeGroupIndex) {
        _configsByGroup = configsByGroup;
        _activeGroupIndex = activeGroupIndex;
        _renderGroupBar();
        _renderChipRow();
    }

    function _renderGroupBar() {
        _groupBarEl.innerHTML = '';
        const groups = GROUP_ORDER.filter(function (g) {
            return _configsByGroup[g] && _configsByGroup[g].length > 0;
        });
        groups.forEach(function (group, index) {
            const tab = document.createElement('button');
            tab.className = 'cb-group-tab' + (index === _activeGroupIndex ? ' cb-group-tab-active' : '');
            tab.textContent = group;
            tab.addEventListener('click', function () {
                if (window._onGroupChange) { window._onGroupChange(index); }
            });
            _groupBarEl.appendChild(tab);
        });
    }

    function _renderChipRow() {
        _chipRowEl.innerHTML = '';
        const groups = GROUP_ORDER.filter(function (g) {
            return _configsByGroup[g] && _configsByGroup[g].length > 0;
        });
        const activeGroup = groups[_activeGroupIndex] || groups[0];
        const configs = (_configsByGroup[activeGroup] || []);
        configs.forEach(function (config) {
            const chip = document.createElement('button');
            chip.className = 'cb-chip' + (config.source === 'user' ? ' cb-chip-user' : '');
            chip.textContent = config.label || config.filename;
            chip.dataset.filename = config.filename;

            // click handles tap on non-touch devices (mouse).
            // On touch devices it is suppressed by preventDefault in touchstart below.
            chip.addEventListener('click', function () {
                if (window._onConfigTap) { window._onConfigTap(config); }
            });

            // Long-press detection via touch events.
            // CSS user-select/touch-callout suppresses text selection and callout on iOS/Android.
            // Taps are handled manually in touchend (synthetic click is not reliable on mobile).
            chip.addEventListener('touchstart', function (e) {
                _touchStartX = e.touches[0].clientX;
                _touchStartY = e.touches[0].clientY;
                _longPressTimer = setTimeout(_fireLongPress.bind(null, config), 500);
            });
            chip.addEventListener('touchend', function () {
                if (_longPressTimer) {
                    clearTimeout(_longPressTimer);
                    _longPressTimer = null;
                    if (window._onConfigTap) { window._onConfigTap(config); }
                }
            });
            chip.addEventListener('touchcancel', _cancelLongPress);
            chip.addEventListener('touchmove', function (e) {
                const dx = e.touches[0].clientX - _touchStartX;
                const dy = e.touches[0].clientY - _touchStartY;
                if (Math.hypot(dx, dy) > 10) { _cancelLongPress(); }
            });

            _chipRowEl.appendChild(chip);
        });
    }

    // ─── Context menu ─────────────────────────────────────────────────────────

    function _openMenu(config) {
        _menuConfig = config;
        document.getElementById('cb-menu-title').textContent = config.label || config.filename;
        const deleteBtn = document.getElementById('cb-menu-delete');
        deleteBtn.style.display = config.source === 'user' ? '' : 'none';
        _contextMenuEl.style.display = '';
    }

    function _closeMenu() {
        _contextMenuEl.style.display = 'none';
        _menuConfig = null;
    }

    function _fireLongPress(config) {
        _longPressTimer = null;
        _openMenu(config);
    }

    function _cancelLongPress() {
        if (_longPressTimer) {
            clearTimeout(_longPressTimer);
            _longPressTimer = null;
        }
    }

    // ─── Public API ───────────────────────────────────────────────────────────

    window.ConfigBrowser = { init: init, render: render };
})();