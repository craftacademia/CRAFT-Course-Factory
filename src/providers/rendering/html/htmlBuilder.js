import fs from "fs/promises";
import path from "path";


function normalizeAssets(value) {

    if (!value) {
        return value;
    }


    if (Array.isArray(value)) {

        return value.map(
            item =>
            normalizeAssets(item)
        );

    }


    if (typeof value === "object") {

        const output = {};

        for (const [key, item] of Object.entries(value)) {

            output[key] =
                normalizeAssets(item);

        }

        return output;

    }


    if (
        typeof value === "string" &&
        value.includes("/uploads/")
    ) {

        return `assets/${path.basename(value)}`;

    }


    return value;

}



export default class HtmlBuilder {


    async build(
        pir,
        outputDirectory
    ) {


        await fs.mkdir(
            outputDirectory,
            {
                recursive:true
            }
        );


        const finalPir =
            normalizeAssets(
                pir
            );


        const dataDirectory =
            path.join(
                outputDirectory,
                "data"
            );


        await fs.mkdir(
            dataDirectory,
            {
                recursive:true
            }
        );



        const html = `<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">


<link rel="icon" href="data:,">


<title>
${finalPir?.course?.title ?? "C.R.A.F.T Course"}
</title>


<style>


html,
body {

    width:100%;

    height:100%;

    margin:0;

    overflow:hidden;

    font-family:
    Arial,
    Helvetica,
    sans-serif;

    background:#111;

}



#app {

    width:100vw;

    height:100vh;

    display:flex;

    align-items:center;

    justify-content:center;

    overflow:hidden;

}



.screen {

    position:relative;

    width:100%;

    height:100%;

    max-width:1280px;

    max-height:720px;

    box-sizing:border-box;

    overflow:hidden;

}



.image-component {

    position:absolute;

    inset:0;

    width:100%;

    height:100%;

    object-fit:contain;

    display:block;

    z-index:1;

}



.dialogue-box {

    position:absolute;

    left:10%;

    right:10%;

    bottom:8%;

    width:auto;

    margin:0;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:20px;

    padding:25px;

    z-index:10;

    box-shadow:
    0 8px 25px rgba(0,0,0,0.35);

}



.dialogue-speaker {

    font-size:28px;

    font-weight:700;

    color:#d71920;

    margin-bottom:12px;

}



.dialogue-text {

    font-size:28px;

    line-height:1.5;

    color:#222;

}



.dialogue-line {

    display:flex;

    flex-direction:column;

}



.speaker-badge {

    position:absolute;

    top:5%;

    left:5%;

    z-index:15;

    display:flex;

    align-items:center;

    gap:10px;

    background:#ffffff;

    border:2px solid #d71920;

    border-radius:999px;

    padding:6px 16px 6px 6px;

    box-shadow:
    0 4px 12px rgba(0,0,0,0.3);

}



.speaker-avatar {

    width:44px;

    height:44px;

    flex-shrink:0;

    border-radius:50%;

    overflow:hidden;

    border:2px solid #d71920;

    background:#f5f5f5;

    display:flex;

    align-items:center;

    justify-content:center;

}



.speaker-avatar img {

    width:44px;

    height:44px;

    object-fit:cover;

    display:block;

}



.speaker-name {

    font-size:16px;

    font-weight:700;

    color:#d71920;

}



</style>


</head>


<body>


<div id="app"></div>


<script>

window.PIR =
${JSON.stringify(finalPir, null, 2)};

</script>


<script type="module" src="runtime.js"></script>


</body>


</html>
`;



        await fs.writeFile(
            path.join(
                outputDirectory,
                "index.html"
            ),
            html,
            "utf8"
        );



        await fs.writeFile(
            path.join(
                dataDirectory,
                "course.json"
            ),
            JSON.stringify(
                finalPir,
                null,
                2
            ),
            "utf8"
        );


        return outputDirectory;

    }

}
