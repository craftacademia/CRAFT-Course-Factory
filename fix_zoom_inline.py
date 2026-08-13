path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    content = f.read()

# Remove the external script tag we added earlier
old_tag = '\n\n\n<script src="characterZoomController.js"></script>'
if old_tag in content:
    content = content.replace(old_tag, '')

# Add inline script instead
old = '<script type="module" src="runtime.js"></script>'
new = '''<script type="module" src="runtime.js"></script>


<script>
(function() {
    const ZOOM = 1.50;
    const T    = 'transform 0.35s ease';
    let timer  = null;

    function img() { return document.querySelector('#craft-stage .image-component'); }

    function zoomIn() {
        if (timer) { clearTimeout(timer); timer = null; }
        const el = img(); if (!el) return;
        el.style.transition = T;
        el.style.transformOrigin = 'center center';
        el.style.transform = 'scale(' + ZOOM + ')';
    }

    function zoomOut() {
        timer = setTimeout(function() {
            const el = img(); if (!el) return;
            el.style.transition = T;
            el.style.transform = 'scale(1.0)';
        }, 400);
    }

    function hasDialogue(node) {
        return node.nodeType === 1 && (
            node.classList && node.classList.contains('dialogue-box') ||
            node.querySelector && node.querySelector('.dialogue-box')
        );
    }

    var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            for (var j = 0; j < m.addedNodes.length; j++) {
                if (hasDialogue(m.addedNodes[j])) { zoomIn(); }
            }
            for (var j = 0; j < m.removedNodes.length; j++) {
                if (hasDialogue(m.removedNodes[j])) { zoomOut(); }
            }
        }
    });

    function start() {
        var stage = document.querySelector('#craft-stage');
        if (stage) { observer.observe(stage, { childList: true, subtree: true }); }
        else { setTimeout(start, 100); }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else { start(); }
})();
</script>'''

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
