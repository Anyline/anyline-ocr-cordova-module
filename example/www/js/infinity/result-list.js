// www/js/infinity/result-list.js
// Renders the horizontal result list and per-card UCR inline interaction.

(function () {
    let _containerEl = null;
    let _headerCountEl = null;
    let _stopBtnEl = null;
    let _listEl = null;
    let _emptyEl = null;

    // ─── Init ─────────────────────────────────────────────────────────────────

    function init(containerEl) {
        _containerEl = containerEl;
        _containerEl.innerHTML =
            '<div id="rl-header">' +
            '  <span id="rl-count">Results (0)</span>' +
            '  <button id="rl-stop" style="display:none">&#9632; Stop</button>' +
            '</div>' +
            '<div id="rl-empty"><span id="rl-empty-text">No results yet.\nTap a config chip to start scanning.</span></div>' +
            '<div id="rl-list"></div>';

        _headerCountEl = document.getElementById('rl-count');
        _stopBtnEl = document.getElementById('rl-stop');
        _listEl = document.getElementById('rl-list');
        _emptyEl = document.getElementById('rl-empty');

        _stopBtnEl.addEventListener('click', function () {
            if (window._onStopScanning) { window._onStopScanning(); }
        });
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    function render(results, isScanning) {
        _headerCountEl.textContent = 'Results (' + results.length + ')';
        _stopBtnEl.style.display = isScanning ? '' : 'none';

        const emptyTextEl = document.getElementById('rl-empty-text');
        if (emptyTextEl) {
            emptyTextEl.textContent = isScanning
                ? 'No results yet'
                : 'No results yet.\nTap a config chip to start scanning.';
        }

        if (results.length === 0) {
            _emptyEl.style.display = '';
            _listEl.style.display = 'none';
        } else {
            _emptyEl.style.display = 'none';
            _listEl.style.display = '';
            _renderCards(results);
        }
    }

    function _renderCards(results) {
        // Preserve existing cards — only prepend newly added ones (results[0] is newest).
        const existingCount = _listEl.querySelectorAll('.rl-card').length;
        const newResults = results.slice(0, results.length - existingCount);
        newResults.reverse().forEach(function (result) {
            const card = _buildCard(result);
            _listEl.insertBefore(card, _listEl.firstChild);
        });
    }

    function _buildCard(result) {
        const pluginResult = result.pluginResult;
        const imageContainer = result.imageContainer;

        const typeLabel = pluginTypeLabel(pluginResult);
        const resultObj = pluginResultMap(pluginResult);
        const resultJson = resultObj ? JSON.stringify(resultObj, null, 2) : '{}';

        // Cutout image src
        let imageSrc = null;
        let savedFilePath = null;
        const savedDir = imageContainer?.saved?.path;
        const savedName = imageContainer?.saved?.images?.cutoutImage;
        if (savedDir && savedName) {
            // file:// URLs to internal storage are blocked by Android WebView.
            // Resolve to cdvfile:// asynchronously via resolveLocalFileSystemURL.
            savedFilePath = 'file://' + savedDir + savedName;
            imageSrc = ''; // populated async below
        } else {
            const b64 = imageContainer?.encoded?.images?.cutoutImage;
            if (b64) { imageSrc = 'data:image/png;base64,' + b64; }
        }

        const blobKey = pluginResult?.blobKey || '';
        const ucrDefault = getPluginResultValueForUCR(pluginResult);

        const card = document.createElement('div');
        card.className = 'rl-card';
        card.dataset.blobKey = blobKey;

        card.innerHTML =
            '<div class="rl-card-type">' + _esc(typeLabel) + '</div>' +
            (imageSrc || savedFilePath
                ? '<img class="rl-card-image" src="' + _esc(imageSrc) + '" />'
                : '<div class="rl-card-image rl-card-image-placeholder">No image</div>') +
            '<pre class="rl-card-json">' + _esc(resultJson.substring(0, 300)) + '</pre>' +
            '<div class="rl-ucr-row">' +
            '  <input class="rl-ucr-input" type="text" value="' + _esc(ucrDefault) + '" placeholder="Corrected result" />' +
            '  <button class="rl-ucr-btn">Report UCR</button>' +
            '</div>' +
            '<div class="rl-ucr-status"></div>';

        card.querySelector('.rl-card-json').addEventListener('click', function () {
            const imgEl = card.querySelector('img.rl-card-image');
            _showDetail(typeLabel, imgEl ? imgEl.src : imageSrc, resultJson);
        });

        card.querySelector('.rl-ucr-btn').addEventListener('click', function () {
            const input = card.querySelector('.rl-ucr-input');
            const statusEl = card.querySelector('.rl-ucr-status');
            _submitUCR(blobKey, input.value, statusEl);
        });

        if (savedFilePath && window.resolveLocalFileSystemURL) {
            window.resolveLocalFileSystemURL(savedFilePath, function (entry) {
                entry.file(_applyImageFromFile.bind(null, card), function () { /* file read failed */ });
            }, function () { /* path not resolvable */ });
        }

        return card;
    }

    function _applyImageFromFile(card, file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            const imgEl = card.querySelector('img.rl-card-image');
            if (imgEl) { imgEl.src = evt.target.result; }
        };
        reader.readAsDataURL(file);
    }

    // --- Anyline: requestUCRReport ---
    function _submitUCR(blobKey, correctedResult, statusEl) {
        statusEl.textContent = 'Submitting…';
        statusEl.className = 'rl-ucr-status';
        AnylineInfinity.requestUCRReport(
            { blobKey: blobKey, correctedResult: correctedResult },
            function (response) {
                const ok = response.status === AnylineEnums.WrapperSessionUcrReportResponseStatus.UcrReportSucceeded;
                statusEl.textContent = ok ? 'UCR reported successfully' : ('UCR failed: ' + (response.failInfo?.lastError || 'Unknown error'));
                statusEl.className = 'rl-ucr-status ' + (ok ? 'rl-ucr-ok' : 'rl-ucr-fail');
            },
            function (err) {
                statusEl.textContent = 'UCR failed: ' + (err || 'Unknown error');
                statusEl.className = 'rl-ucr-status rl-ucr-fail';
            }
        );
    }

    function _showDetail(typeLabel, imageSrc, resultJson) {
        const overlay = document.createElement('div');
        overlay.className = 'rl-detail-overlay';
        overlay.innerHTML =
            '<div class="rl-detail-backdrop"></div>' +
            '<div class="rl-detail-sheet">' +
            '  <div class="rl-detail-handle"></div>' +
            '  <div class="rl-detail-title">' + _esc(typeLabel) + '</div>' +
            (imageSrc
                ? '<img class="rl-detail-image" src="' + _esc(imageSrc) + '" />'
                : '<div class="rl-detail-image rl-card-image-placeholder">No image</div>') +
            '  <pre class="rl-detail-json">' + _esc(resultJson) + '</pre>' +
            '</div>';
        overlay.querySelector('.rl-detail-backdrop').addEventListener('click', function () {
            overlay.remove();
        });
        document.body.appendChild(overlay);
    }

    function _esc(s) {
        return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    }

    window.ResultList = { init: init, render: render };
})();