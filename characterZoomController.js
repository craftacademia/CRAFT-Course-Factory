/**
 * characterZoomController.js
 *
 * Watches for dialogue boxes appearing and disappearing in the DOM.
 * When a dialogue line is active, zooms the scene image to scale(1.50).
 * When dialogue ends, resets to scale(1.0).
 *
 * Uses MutationObserver — zero changes to any existing API.
 */
(function() {

    const ZOOM_SCALE    = 1.50;
    const TRANSITION    = 'transform 0.35s ease';
    const ZOOM_IN_DELAY = 0;      // ms after dialogue appears before zooming in
    const ZOOM_OUT_LAG  = 400;    // ms before zoom-out starts (so it doesn't snap back)

    let zoomOutTimer = null;

    function getImage() {
        return document.querySelector('#craft-stage .image-component');
    }

    function zoomIn() {
        if (zoomOutTimer) {
            clearTimeout(zoomOutTimer);
            zoomOutTimer = null;
        }
        const img = getImage();
        if (!img) return;
        img.style.transition     = TRANSITION;
        img.style.transformOrigin = 'center center';
        img.style.transform      = `scale(${ZOOM_SCALE})`;
    }

    function zoomOut() {
        zoomOutTimer = setTimeout(() => {
            const img = getImage();
            if (!img) return;
            img.style.transition = TRANSITION;
            img.style.transform  = 'scale(1.0)';
            zoomOutTimer = null;
        }, ZOOM_OUT_LAG);
    }

    function hasDialogue(node) {
        return node.nodeType === 1 && (
            node.classList?.contains('dialogue-box') ||
            node.querySelector?.('.dialogue-box')
        );
    }

    const observer = new MutationObserver(mutations => {

        for (const mutation of mutations) {

            // Dialogue appeared
            for (const node of mutation.addedNodes) {
                if (hasDialogue(node)) {
                    zoomIn();
                    break;
                }
            }

            // Dialogue removed
            for (const node of mutation.removedNodes) {
                if (hasDialogue(node)) {
                    zoomOut();
                    break;
                }
            }

        }

    });

    // Start observing once the stage exists
    function startObserving() {
        const stage = document.querySelector('#craft-stage');
        if (stage) {
            observer.observe(stage, { childList: true, subtree: true });
        } else {
            setTimeout(startObserving, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }

})();
