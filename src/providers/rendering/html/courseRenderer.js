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


        const renderedPages =
            pages
                .map(page => {

                    return this.sceneRenderer.render(
                        page
                    );

                })
                .join("\n");



        const assetData =
            assets
                ? `
<script>
window.CRAFT_ASSETS = ${JSON.stringify(assets)};
</script>
`
                : "";



        return `
${assetData}

${renderedPages}
`;

    }

}