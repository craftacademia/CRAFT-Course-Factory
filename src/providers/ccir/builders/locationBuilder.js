import { walk } from "../utils/treeWalker.js";

export default class LocationBuilder {

    build(ast) {

        const locations = [];
        const existing = new Set();


        walk(ast, node => {

            if (node.type !== "LOCATION") {
                return;
            }

            const id =
                node.attributes?.id ??
                node.attributes?.name ??
                null;


            if (!id || existing.has(id)) {
                return;
            }


            existing.add(id);


            locations.push({

                id,

                name:
                    node.attributes?.name ?? id,

                description:
                    node.children
                        ?.filter(child => child.type === "TEXT")
                        .map(child => child.value)
                        .join("\n")
                        .trim() ?? "",

                attributes:
                    node.attributes ?? {},

                children:
                    node.children ?? []

            });

        });


        walk(ast, node => {

            if (node.type !== "SCREEN") {
                return;
            }


            const location =
                node.attributes?.location ?? null;


            if (!location || existing.has(location)) {
                return;
            }


            existing.add(location);


            locations.push({

                id: location,

                name: location,

                description: "",

                attributes: {
                    generated: true
                },

                children: []

            });

        });


        return locations;

    }

}