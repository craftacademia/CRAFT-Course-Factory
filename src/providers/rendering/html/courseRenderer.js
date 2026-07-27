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


        const theme =
            pir.theme ?? "modern";



        const renderedPages =
            pages
                .map(page =>
                    this.sceneRenderer.render(page)
                )
                .join("\n");



        const logo =
            branding?.logo?.path
                ? branding.logo.path
                : "";



        const themeStyle =
            this.resolveTheme(theme);



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

            audio,

            theme

        };



        return `
<style>

${themeStyle}


.screen {

    width:100%;

    min-height:500px;

    box-sizing:border-box;

    padding:40px;

}


.screen-content,
.screen-dialogue,
.screen-image,
.screen-assessment {

    border-radius:12px;

}


.slide-template-content,
.slide-template-dialogue,
.slide-template-image,
.slide-template-assessment {

    max-width:1000px;

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


    resolveTheme(theme) {

        const themes = {


            modern: `

:root {

    --craft-primary:#1e3a8a;

    --craft-secondary:#f59e0b;

}

.screen-content {

    background:#ffffff;

}

`,


            corporate: `

:root {

    --craft-primary:#0f172a;

    --craft-secondary:#2563eb;

}

.screen-content {

    background:#f8fafc;

}

`,


            storytelling: `

:root {

    --craft-primary:#7c2d12;

    --craft-secondary:#ea580c;

}

.screen-content {

    background:#fff7ed;

}

`

        };


        return themes[theme] ?? themes.modern;

    }

}