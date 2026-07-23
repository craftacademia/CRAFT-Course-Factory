import ImageResolver from "./imageResolver.js";
import AudioResolver from "./audioResolver.js";
import AssetResolver from "./assetResolver.js";

export default class MediaResolver {

  constructor() {

    this.images = new ImageResolver();
    this.audio = new AudioResolver();
    this.assets = new AssetResolver();

  }

  async resolve(ccir) {

    return {
      images: this.images.resolve(ccir),
      audio: this.audio.resolve(ccir),
      assets: this.assets.resolve(ccir)
    };

  }

}
