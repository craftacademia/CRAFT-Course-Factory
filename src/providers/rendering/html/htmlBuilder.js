import PageBuilder from "./pageBuilder.js";

export default class HtmlBuilder {

  constructor() {
    this.pageBuilder = new PageBuilder();
  }

  async build(ccir) {

    return ccir.screens.map(screen =>
      this.pageBuilder.build(screen)
    );

  }

}
