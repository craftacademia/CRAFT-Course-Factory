import fs from "fs/promises";
import path from "path";

import HtmlBuilder from "../html/htmlBuilder.js";
import CssBuilder from "../css/cssBuilder.js";
import RuntimeBuilder from "../runtime/runtimeBuilder.js";
import AssetBundler from "../assets/assetBundler.js";


export default class PackageBuilder {

    constructor() {

        this.htmlBuilder = new HtmlBuilder();

        this.cssBuilder = new CssBuilder();

        this.runtimeBuilder = new RuntimeBuilder();

        this.assetBundler = new AssetBundler();

    }


    async build(
        pir,
        outputPath,
        assets = []
    ) {

        await fs.mkdir(
            outputPath,
            {
                recursive:true
            }
        );


        await this.htmlBuilder.build(
            pir,
            outputPath
        );


        await this.cssBuilder.build(
            path.join(
                outputPath,
                "styles.css"
            )
        );


        await this.runtimeBuilder.build(
            path.join(
                outputPath,
                "runtime.js"
            )
        );


        await this.assetBundler.build(
            assets,
            outputPath
        );


        await fs.writeFile(
            path.join(
                outputPath,
                "course.js"
            ),
            `
window.COURSE = window.PIR;
`
        );


        return {
            output: outputPath,
            index: path.join(outputPath,"index.html"),
            stylesheet:path.join(outputPath,"styles.css"),
            runtime:path.join(outputPath,"runtime.js"),
            course:path.join(outputPath,"course.js"),
            assets:path.join(outputPath,"assets")
        };

    }

}