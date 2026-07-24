export default class AssetLoader {

    constructor() {

        this.cache = new Map();

    }

    async load(asset) {

        if (this.cache.has(asset.id)) {
            return this.cache.get(asset.id);
        }

        const image = new Image();

        await new Promise((resolve, reject) => {

            image.onload = resolve;
            image.onerror = reject;
            image.src = asset.src;

        });

        this.cache.set(asset.id, image);

        return image;

    }

    get(id) {

        return this.cache.get(id);

    }

    has(id) {

        return this.cache.has(id);

    }

    unload(id) {

        this.cache.delete(id);

    }

    clear() {

        this.cache.clear();

    }

}