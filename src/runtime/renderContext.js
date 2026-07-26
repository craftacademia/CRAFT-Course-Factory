export default class RenderContext {

    constructor() {

        this.reset();

    }

    reset() {

        this.output = [];

        this.metadata = new Map();

    }

    append(html) {

        if (html === undefined || html === null) {
            return;
        }

        this.output.push(String(html));

    }

    prepend(html) {

        if (html === undefined || html === null) {
            return;
        }

        this.output.unshift(String(html));

    }

    set(key, value) {

        this.metadata.set(key, value);

    }

    get(key) {

        return this.metadata.get(key);

    }

    has(key) {

        return this.metadata.has(key);

    }

    remove(key) {

        return this.metadata.delete(key);

    }

    clearMetadata() {

        this.metadata.clear();

    }

    render() {

        return this.output.join("\n");

    }

    flush() {

        const html = this.render();

        this.reset();

        return html;

    }

    size() {

        return this.output.length;

    }

}