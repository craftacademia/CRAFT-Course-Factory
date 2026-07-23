import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

  constructor() {
    this.componentBuilder = new ComponentBuilder();
  }

  build(screen) {

    return {
      id: screen.id,
      title: screen.title,
      html: this.componentBuilder.build(screen)
    };

  }

}
