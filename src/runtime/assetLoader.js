export default class AssetLoader {


    constructor() {

        this.cache = new Map();

    }



    async load(asset) {


        if (!asset) {

            throw new Error(
                "Asset is required."
            );

        }


        const id =
            asset.id ??
            asset.name ??
            asset.path ??
            asset.src;



        if (!id) {

            throw new Error(
                "Asset id is required."
            );

        }



        let src =
            asset.src ??
            asset.path ??
            null;



        if (!src) {

            throw new Error(
                "Asset source is required."
            );

        }



        if (
            src.startsWith("assets/")
        ) {

            src =
                `./${src}`;

        }



        if (this.cache.has(id)) {

            return this.cache.get(id);

        }



        const extension =
            src.split("?")[0]
            .split(".")
            .pop()
            .toLowerCase();



        if (
            [
                "mp3",
                "wav",
                "ogg"
            ].includes(extension)
        ) {


            const audio =
                new Audio();


            await new Promise(
                (resolve,reject)=>{


                    audio.oncanplaythrough =
                        resolve;


                    audio.onerror =
                        () =>
                        reject(
                            new Error(
                                `Failed to load asset: ${src}`
                            )
                        );


                    audio.src =
                        src;


                }
            );


            this.cache.set(
                id,
                audio
            );


            return audio;

        }



        const image =
            new Image();



        await new Promise(
            (resolve,reject)=>{


                image.onload =
                    resolve;


                image.onerror =
                    () =>
                    reject(
                        new Error(
                            `Failed to load asset: ${src}`
                        )
                    );


                image.src =
                    src;


            }
        );



        this.cache.set(
            id,
            image
        );


        return image;

    }



    clear() {

        this.cache.clear();

    }

}