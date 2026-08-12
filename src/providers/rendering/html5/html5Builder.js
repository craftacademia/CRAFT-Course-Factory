import fs from "fs/promises";
import path from "path";

import HtmlBuilder from "../html/htmlBuilder.js";
import AssetBundler from "../assets/assetBundler.js";


export default class Html5Builder {


    constructor() {

        this.htmlBuilder =
            new HtmlBuilder();


        this.assetBundler =
            new AssetBundler();

    }



    async build(
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


        await this.assetBundler.build(
            this.collectAssets(pir),
            outputDirectory
        );


        await this.copyBranding(pir, outputDirectory);
        await this.copyRuntimeTree(
            outputDirectory
        );


        return outputDirectory;

    }



    async copyBranding(pir, outputDirectory) {
        const logo = pir && pir.branding && pir.branding.logo;
        if (!logo || !logo.uploadPath) return;
        const assetsDir = path.join(outputDirectory, "assets");
        await fs.mkdir(assetsDir, { recursive: true });
        await fs.copyFile(logo.uploadPath, path.join(assetsDir, logo.name));
    }


    async copyRuntimeTree(
        outputDirectory
    ) {

        const source =
            path.resolve(
                "src/runtime"
            );


        const destination =
            outputDirectory;



        await this.copyDirectory(
            source,
            destination
        );

    }



    async copyDirectory(
        source,
        destination
    ) {

        await fs.mkdir(
            destination,
            {
                recursive:true
            }
        );


        const entries =
            await fs.readdir(
                source,
                {
                    withFileTypes:true
                }
            );


        for (const entry of entries) {


            const sourcePath =
                path.join(
                    source,
                    entry.name
                );


            const destinationPath =
                path.join(
                    destination,
                    entry.name
                );



            if (entry.isDirectory()) {


                await this.copyDirectory(
                    sourcePath,
                    destinationPath
                );


            } else {


                await fs.copyFile(
                    sourcePath,
                    destinationPath
                );

            }

        }

    }



    collectAssets(
        pir
    ) {

        const assets = [];


        const source =
            pir?.assets ?? {};



        for (const image of source.images ?? []) {

            assets.push({

                src:image.src,

                path:image.path,

                name:image.name,

                type:"image"

            });

        }



        for (const group of [
            ...(source.audio?.narration ?? []),
            ...(source.audio?.dialogue ?? []),
            ...(source.audio?.background ?? [])
        ]) {

            assets.push({

                src:group.src,

                path:group.path,

                name:group.name,

                type:"audio"

            });

        }


        return assets;

    }

}