import fs from "fs/promises";
import path from "path";

import PackageBuilder from "./packageBuilder.js";

export default class OutputWriter {

  constructor() {

    this.packageBuilder = new PackageBuilder();

  }

  async write({ html, css, runtime, media, outputPath }) {

    await fs.mkdir(outputPath, { recursive: true });

    await fs.writeFile(
      path.join(outputPath, "pages.json"),
      JSON.stringify(html, null, 2)
    );

    await fs.writeFile(
      path.join(outputPath, "styles.css"),
      css
    );

    await fs.writeFile(
      path.join(outputPath, "runtime.js"),
      runtime
    );

    await fs.writeFile(
      path.join(outputPath, "media.json"),
      JSON.stringify(media, null, 2)
    );

    await this.packageBuilder.build(outputPath);

    return outputPath;

  }

}
