path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    content = f.read()

old = """    async mount(course) {
        if (!course) {
            throw new Error("Course is required.");
        }
        this.clear();
        this.course = course;
        this.state.reset();
        this.navigation =
            new NavigationEngine(course);
        this.isMounted = true;
        await this.showStartGate();
        await this.renderCurrentPage();
    }"""

new = """    async mount(course) {
        if (!course) {
            throw new Error("Course is required.");
        }
        this.clear();
        this.course = course;
        this.state.reset();
        this.navigation =
            new NavigationEngine(course);
        this.isMounted = true;
        window.__craftRuntime = this;
        await this.showStartGate();
        await this.renderCurrentPage();
    }"""

count = content.count(old)
assert count == 1, f'anchor not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
