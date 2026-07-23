export default class PageBuilder {

    build(ccir) {

        const pages = [];

        if (!Array.isArray(ccir.locations)) {
            return pages;
        }

        for (const location of ccir.locations) {

            pages.push({

                id: location.id,

                name: location.name,

                title: location.name,

                background: location.id,

                layers: []

            });

        }

        return pages;

    }

}
