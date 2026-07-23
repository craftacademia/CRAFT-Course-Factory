import PageBuilder from "./pageBuilder.js";

export default class CourseBuilder {

    constructor() {
        this.pageBuilder = new PageBuilder();
    }

    build(ccir) {

        return {

            version: ccir.version,

            generatedAt: ccir.generatedAt,

            course: {
                id: ccir.course?.id,
                title: ccir.course?.title,
                version: ccir.course?.version
            },

            pages: this.pageBuilder.build(ccir)

        };

    }

}
