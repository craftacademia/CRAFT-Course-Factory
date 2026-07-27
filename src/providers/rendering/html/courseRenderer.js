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


        const audio =
            pir.audio ?? assets?.audio ?? null;



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


.screen {

    width:100%;

    min-height:500px;

    box-sizing:border-box;

    padding:40px;

}


.screen-content {

    background:#ffffff;

}


.screen-dialogue {

    background:#f8fafc;

    border-left:8px solid var(--craft-primary);

}


.screen-image {

    background:#ffffff;

    display:flex;

    justify-content:center;

}


.screen-assessment {

    background:#fff7ed;

    border:2px solid var(--craft-secondary);

}


.slide-template-content {

    max-width:900px;

    margin:auto;

}


.slide-template-dialogue {

    max-width:900px;

    margin:auto;

}


.slide-template-image {

    max-width:1000px;

    margin:auto;

}


.slide-template-assessment {

    max-width:900px;

    margin:auto;

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

            branding,

            audio

        };



        return `
${brandingStyle}

<script>

window.CRAFT_CONFIG =
${JSON.stringify(runtimeConfig)};

window.CRAFT_ASSETS =
${JSON.stringify(assets)};

window.CRAFT_BRANDING =
${JSON.stringify(branding)};

window.CRAFT_AUDIO =
${JSON.stringify(audio)};

</script>

${brandingHeader}

${renderedPages}
`;

    }

}