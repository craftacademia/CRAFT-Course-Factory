export default class ImageResolver {

  resolve(ccir) {

    return ccir.assets.filter(asset =>
      asset.type?.toLowerCase() === "image"
    );

  }

}
