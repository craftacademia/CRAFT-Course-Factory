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


        const assets =
            this.collectAssets(
                pir
            );


        await this.assetBundler.build(
            assets,
            outputDirectory
        );


        return outputDirectory;

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



        if (source.branding?.logo) {

            assets.push({

                src:
                    source.branding.logo.src,

                path:
                    source.branding.logo.path,

                name:
                    source.branding.logo.name,

                type:"image"

            });

        }


        return assets;

    }

}