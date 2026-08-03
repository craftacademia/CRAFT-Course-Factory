import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

    constructor() {

        this.componentBuilder = new ComponentBuilder();

    }

    build(screen) {

        return {
            id: screen.id,
            title: screen.title ?? "",
            duration: screen.duration ?? 0,
            layers: [
                {
                    id: "LAYER_001",
                    components: this.componentBuilder.build(screen)
                }
            ]
        };

    }

}