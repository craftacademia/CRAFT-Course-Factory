import CourseBuilder from "./builders/courseBuilder.js";

export default class PresentationProvider {

    constructor() {
        this.courseBuilder = new CourseBuilder();
    }

    async build(ccir) {
        return this.courseBuilder.build(ccir);
    }

}
