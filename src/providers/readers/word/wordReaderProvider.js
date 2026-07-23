import mammoth from "mammoth";
import Provider from "../../../core/provider.js";

export default class WordReaderProvider extends Provider {

  constructor() {
    super("word-reader");
  }

  async read(filePath) {

    const result = await mammoth.extractRawText({
      path: filePath
    });

    return result.value;

  }

}
