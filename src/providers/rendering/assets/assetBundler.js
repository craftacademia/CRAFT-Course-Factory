import fs from "fs/promises";
import path from "path";

export default class AssetBundler {

    async build(
        assets = [],
        outputDirectory
    ) {

        const outputAssetsDirectory =
            path.join(
                outputDirectory,
                "assets"
            );


        await fs.mkdir(
            outputAssetsDirectory,
            {
                recursive:true
            }
        );


        const bundledAssets = [];


        for (const asset of assets) {


            if (!asset?.src) {

                continue;

            }



            const fileName =
                asset.name ??
                path.basename(
                    asset.src
                );



            const destination =
                path.join(
                    outputAssetsDirectory,
                    fileName
                );



            await fs.copyFile(
                asset.src,
                destination
            );



            bundledAssets.push({

                ...asset,

                bundledPath:
                    `assets/${fileName}`

            });


        }


        return bundledAssets;

    }

}