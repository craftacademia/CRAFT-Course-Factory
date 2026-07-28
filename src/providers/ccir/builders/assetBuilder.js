import { walk } from "../utils/treeWalker.js";

export default class AssetBuilder {

    build(ast) {

        const assets = {

            images: [],

            audio: {},

            branding: null

        };


        walk(ast, node => {

            if (node.type !== "ASSET") {
                return;
            }


            const asset = {

                id:
                    node.attributes?.id ?? null,

                name:
                    node.attributes?.name ?? null,

                type:
                    node.attributes?.type ?? null,

                src:
                    node.attributes?.src ?? null,

                alt:
                    node.attributes?.alt ?? null,

                attributes:
                    node.attributes ?? {}

            };


            switch (asset.type) {

                case "IMAGE":

                    assets.images.push(asset);

                    break;


                case "AUDIO":

                    if (!assets.audio.background) {
                        assets.audio.background = [];
                    }

                    assets.audio.background.push(asset);

                    break;


                case "BRANDING":

                    assets.branding = asset;

                    break;


                default:

                    break;

            }

        });


        return assets;

    }

}