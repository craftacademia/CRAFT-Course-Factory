import fs from "fs/promises";
import path from "path";

import HtmlBuilder from "./html/htmlBuilder.js";
import CssBuilder from "./css/cssBuilder.js";
import RuntimeBuilder from "./runtime/runtimeBuilder.js";

export default class RendererProvider {

  constructor() {
    this.htmlBuilder = new HtmlBuilder();
    this.cssBuilder = new CssBuilder();
    this.runtimeBuilder = new RuntimeBuilder();
  }

  async render(pir, outputDirectory) {

    console.log("Renderer output:", outputDirectory);

    await fs.mkdir(outputDirectory, { recursive: true });

    await this.htmlBuilder.build(
      pir,
      outputDirectory
    );

    await this.cssBuilder.build(
      path.join(outputDirectory, "styles.css")
    );

    await this.runtimeBuilder.build(
      path.join(outputDirectory, "runtime.js")
    );

    console.log("Renderer finished.");

  }

}