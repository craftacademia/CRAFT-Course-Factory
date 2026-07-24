export default class RenderContext {

    constructor() {

        this.output = [];

    }

    append(html) {

        this.output.push(html);

    }

    render() {

        return this.output.join("\n");

    }

    flush() {

        return this.render();

    }

}