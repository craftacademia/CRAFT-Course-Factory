path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    content = f.read()

old = """        slot.innerHTML = "";


        const badgeSlot =
            this.rootElement.querySelector(
                "#speaker-badge-slot"
            );

        if (badgeSlot) {

            badgeSlot.innerHTML = "";

        }

    }



    mountInteractions(page) {"""

new = """        slot.innerHTML = "";

        // Clear the stale resolver so a late 'pause' event from the
        // last dialogue audio cannot accidentally resolve the first
        // branching option's promise before it even starts playing.
        this.currentAudioResolve = null;
        this.currentAudio = null;


        const badgeSlot =
            this.rootElement.querySelector(
                "#speaker-badge-slot"
            );

        if (badgeSlot) {

            badgeSlot.innerHTML = "";

        }

    }



    mountInteractions(page) {"""

count = content.count(old)
assert count == 1, f'anchor not found or not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
