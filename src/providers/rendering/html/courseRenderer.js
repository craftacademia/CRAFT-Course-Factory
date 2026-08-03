import ThemeProvider from "./themeProvider.js";


export default class CourseRenderer {


    constructor() {

        this.themeProvider =
            new ThemeProvider();

    }



    render(course) {


        const theme =
            this.themeProvider.get(
                course.theme ?? "modern"
            );



        const pages =
            (course.pages ?? [])
            .map(
                page =>
                this.renderPage(
                    page
                )
            )
            .join("");



        return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
${course.course?.title ?? "Course"}
</title>


<style>


${theme}



body {

    margin:0;

    font-family:
    Arial,
    Helvetica,
    sans-serif;

    background:#f5f5f5;

}



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



.screen-dialogue {

    position:relative;

}



.slide-template-content,
.slide-template-dialogue,
.slide-template-image,
.slide-template-assessment {

    max-width:1100px;

    margin:auto;

}



.slide-template-dialogue {

    background:#ffffff;

    border:4px solid var(--craft-primary);

    border-radius:20px;

    padding:35px;

    box-shadow:
    0 8px 25px rgba(0,0,0,0.25);

}



.dialogue-box {

    width:100%;

}



.dialogue-line {

    display:flex;

    flex-direction:column;

    gap:14px;

}



.dialogue-speaker {

    font-size:32px;

    font-weight:700;

    color:var(--craft-primary);

}



.dialogue-text {

    font-size:30px;

    font-weight:500;

    line-height:1.5;

    color:#222;

}



.dialogue {

    font-size:30px;

}



.slide-template-image img {

    width:100%;

    border-radius:12px;

}



</style>


</head>


<body>


${pages}


</body>


</html>

`;

    }



    renderPage(page) {


        const layers =
            (page.layers ?? [])
            .map(
                layer =>
                this.renderLayer(
                    layer
                )
            )
            .join("");



        return `

<section
class="screen screen-${page.id}">

${layers}

</section>

`;

    }



    renderLayer(layer) {


        const components =
            (layer.components ?? [])
            .map(
                component =>
                component.html ?? ""
            )
            .join("");



        return `

<div class="slide-template-${layer.type?.toLowerCase() ?? "content"}">

${components}

</div>

`;

    }

}