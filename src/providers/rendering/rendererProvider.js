import Provider from "../../core/provider.js";

import HtmlBuilder from "./html/htmlBuilder.js";
import CssBuilder from "./css/cssBuilder.js";
import RuntimeBuilder from "./runtime/runtimeBuilder.js";
import MediaResolver from "./media/mediaResolver.js";
import OutputWriter from "./output/outputWriter.js";

export default class RendererProvider extends Provider {

  constructor() {

    super("renderer");

    this.htmlBuilder = new HtmlBuilder();
    this.cssBuilder = new CssBuilder();
    this.runtimeBuilder = new RuntimeBuilder();
    this.mediaResolver = new MediaResolver();
    this.outputWriter = new OutputWriter();

  }

  async render(ccir, outputPath) {

    const html = await this.htmlBuilder.build(ccir);
    const css = await this.cssBuilder.build(ccir);
    const runtime = await this.runtimeBuilder.build(ccir);
    const media = await this.mediaResolver.resolve(ccir);

    return this.outputWriter.write({
      html,
      css,
      runtime,
      media,
      outputPath
    });

  }

}
