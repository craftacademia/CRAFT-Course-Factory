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



        const logo =
            branding?.logo?.path
                ? branding.logo.path
                : "";



        const brandingStyle =
            `
<style>

:root {

    --craft-primary:
        ${branding?.primaryColor ?? "#1e3a8a"};

    --craft-secondary:
        ${branding?.secondaryColor ?? "#f59e0b"};

}


.craft-brand-header {

    display:flex;

    align-items:center;

    padding:20px;

    background:
        var(--craft-primary);

}


.craft-brand-header img {

    max-height:60px;

    max-width:200px;

}


</style>
`;



        const brandingHeader =
            logo
                ?
`
<div class="craft-brand-header">

<img src="${logo}" />

</div>
`
                :
"";



        const runtimeConfig = {

            assets,

            branding

        };



        const assetData =
`
<script>

window.CRAFT_CONFIG =
${JSON.stringify(runtimeConfig)};

window.CRAFT_ASSETS =
${JSON.stringify(assets)};

window.CRAFT_BRANDING =
${JSON.stringify(branding)};

</script>
`;



        return `
${brandingStyle}

${assetData}

${brandingHeader}

${renderedPages}
`;

    }

}