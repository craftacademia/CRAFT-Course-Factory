export default class AssetLoader {

    constructor() {

        this.cache = new Map();

    }

    async load(asset) {

        if (!asset) {
            throw new Error("Asset is required.");
        }

        if (!asset.id) {
            throw new Error("Asset id is required.");
        }

        if (!asset.src) {
            throw new Error("Asset source is required.");
        }

        if (this.cache.has(asset.id)) {
            return this.cache.get(asset.id);
        }

        const image = new Image();

        await new Promise((resolve, reject) => {

            image.onload = () => resolve(image);

            image.onerror = () =>
                reject(new Error(`Failed to load asset: ${asset.src}`));

            image.src = asset.src;

        });

        this.cache.set(asset.id, image);

        return image;

    }

    async preload(assets = []) {

        const loaded = [];

        for (const asset of assets) {
            loaded.push(await this.load(asset));
        }

        return loaded;

    }

    get(id) {

        return this.cache.get(id) ?? null;

    }

    has(id) {

        return this.cache.has(id);

    }

    unload(id) {

        return this.cache.delete(id);

    }

    clear() {

        this.cache.clear();

    }

    size() {

        return this.cache.size;

    }

}