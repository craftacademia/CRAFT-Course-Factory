import SceneRenderer from "./sceneRenderer.js";

export default class CourseRenderer {

    constructor() {

        this.sceneRenderer =
            new SceneRenderer();

    }


    render(pir) {

        if (!pir) {

            return "";

        }


        const pages =
            pir.pages ?? [];


        const assets =
            pir.assets ?? null;


        const branding =
            pir.branding ?? assets?.branding ?? null;


        const renderedPages =
            pages
                .map(page => {

                    return this.sceneRenderer.render(
                        page
                    );

                })
                .join("\n");



        const runtimeConfig = {

            assets,

            branding

        };



        const assetData =
            `
<script>
window.CRAFT_CONFIG = ${JSON.stringify(runtimeConfig)};
window.CRAFT_ASSETS = ${JSON.stringify(assets)};
window.CRAFT_BRANDING = ${JSON.stringify(branding)};
</script>
`;



        return `
${assetData}

${renderedPages}
`;

    }

}