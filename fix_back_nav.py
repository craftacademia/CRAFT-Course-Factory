path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/navigationEngine.js'

with open(path) as f:
    content = f.read()

old = """    previous() {
        if (this.hasPrevious()) {
            return this.navigate(
                this.currentPage - 1
            );
        }
        return this.current();
    }"""

new = """    previous() {
        if (this.history.length > 1) {
            // Pop current page from history
            this.history.pop();
            // Go to the last visited page
            const prevIndex = this.history[this.history.length - 1];
            // Pop it too so navigate() can push it back cleanly
            this.history.pop();
            return this.navigate(prevIndex);
        }
        return this.current();
    }"""

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)
print('Done')
