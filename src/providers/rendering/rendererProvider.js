import Html5Builder from "./html5/html5Builder.js";


export default class RendererProvider {


    constructor() {

        this.html5Builder =
            new Html5Builder();

    }



    async render(
        pir,
        outputDirectory
    ) {

        await this.buildHtml5Artifact(
            pir,
            outputDirectory
        );

    }



    async buildHtml5Artifact(
        pir,
        outputDirectory
    ) {

        return await this.html5Builder.build(
            pir,
            outputDirectory
        );

    }

}