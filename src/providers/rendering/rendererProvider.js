import fs from "fs/promises";
import path from "path";

import HtmlBuilder from "./html/htmlBuilder.js";
import CssBuilder from "./css/cssBuilder.js";
import RuntimeBuilder from "./runtime/runtimeBuilder.js";
import ScormBuilder from "./scorm/scormBuilder.js";


export default class RendererProvider {


    constructor() {

        this.htmlBuilder =
            new HtmlBuilder();

        this.cssBuilder =
            new CssBuilder();

        this.runtimeBuilder =
            new RuntimeBuilder();

        this.scormBuilder =
            new ScormBuilder();

    }



    async render(
        pir,
        outputDirectory
    ) {

        console.log(
            "Renderer output:",
            outputDirectory
        );


        await fs.mkdir(
            outputDirectory,
            {
                recursive:true
            }
        );


        const html5Directory =
            path.join(
                outputDirectory,
                "html5"
            );


        await this.buildHtml5Artifact(
            pir,
            html5Directory
        );


        await this.buildScormArtifact(
            html5Directory,
            path.join(
                outputDirectory,
                "scorm"
            )
        );


        console.log(
            "Renderer finished."
        );

    }



    async buildHtml5Artifact(
        pir,
        outputDirectory
    ) {

        await fs.mkdir(
            outputDirectory,
            {
                recursive:true
            }
        );


        await this.htmlBuilder.build(
            pir,
            outputDirectory
        );


        await this.cssBuilder.build(
            path.join(
                outputDirectory,
                "styles.css"
            )
        );


        await this.runtimeBuilder.build(
            path.join(
                outputDirectory,
                "runtime.js"
            )
        );


        return outputDirectory;

    }



    async buildScormArtifact(
        html5Directory,
        outputDirectory
    ) {

        return await this.scormBuilder.build(
            html5Directory,
            outputDirectory
        );

    }

}