export default class AudioResolver {

  resolve(ccir) {

    return ccir.assets.filter(asset =>
      asset.type?.toLowerCase() === "audio"
    );

  }

}
