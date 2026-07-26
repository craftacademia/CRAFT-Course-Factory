import LayerBuilder from "./layerBuilder.js";
import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

    constructor() {

        this.layerBuilder = new LayerBuilder();
        this.componentBuilder = new ComponentBuilder();

    }

    build(ccir) {

        const pages = [];

        if (!Array.isArray(ccir.screens)) {
            return pages;
        }

        let pageNo = 1;

        for (const screen of ccir.screens) {

            const components = [];

            this.addScreenComponents(
                screen,
                components,
                pageNo
            );

            pages.push({

                id: screen.id ?? `PAGE_${pageNo}`,

                title: screen.title ?? "",

                layers: [
                    this.layerBuilder.build(
                        "CONTENT",
                        components
                    )
                ]

            });

            pageNo++;

        }

        return pages;

    }


    addScreenComponents(screen, components, pageNo) {


        if (screen.asset) {

            components.push(
                this.componentBuilder.build(
                    "BACKGROUND",
                    {
                        id: `BACKGROUND_${pageNo}`,
                        asset: screen.asset
                    }
                )
            );

        }


        if (screen.character) {

            components.push(
                this.componentBuilder.build(
                    "CHARACTER",
                    {
                        id: `CHARACTER_${pageNo}`,
                        properties: {
                            name: screen.character
                        }
                    }
                )
            );

        }


        if (screen.location) {

            components.push(
                this.componentBuilder.build(
                    "LOCATION",
                    {
                        id: `LOCATION_${pageNo}`,
                        properties: {
                            name: screen.location
                        }
                    }
                )
            );

        }


        for (const child of screen.children ?? []) {

            this.mapChild(
                child,
                components,
                pageNo
            );

        }

    }


    mapChild(child, components, pageNo) {


        if (!child) {
            return;
        }


        if (
            child.type === "TEXT" ||
            child.type === "LINE"
        ) {

            components.push(
                this.componentBuilder.build(
                    "NARRATION",
                    {
                        id: `NARRATION_${pageNo}_${components.length + 1}`,
                        properties: {
                            text:
                                child.value ??
                                child.text ??
                                ""
                        }
                    }
                )
            );

            return;

        }


        if (child.type === "DIALOGUE") {

            const text =
                (child.children ?? [])
                    .filter(item =>
                        item.type === "TEXT" ||
                        item.type === "LINE"
                    )
                    .map(item =>
                        item.value ??
                        item.text ??
                        ""
                    )
                    .join(" ");


            components.push(
                this.componentBuilder.build(
                    "DIALOGUE",
                    {
                        id: `DIALOGUE_${pageNo}_${components.length + 1}`,
                        properties: {
                            text
                        }
                    }
                )
            );

            return;

        }


        if (child.type === "BRANCH_POINT") {

            components.push(
                this.componentBuilder.build(
                    "INTERACTION",
                    {
                        id: `INTERACTION_${pageNo}_${components.length + 1}`,
                        properties: {
                            type: "BRANCH_POINT",
                            data: child
                        }
                    }
                )
            );

        }

    }

}