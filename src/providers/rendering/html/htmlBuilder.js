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

    flex-direction:column;

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



.craft-player-header {

    height:64px;

    flex-shrink:0;

    display:flex;

    align-items:center;

    justify-content:space-between;

    padding:0 20px;

    background:#ffffff;

    border-bottom:1px solid #e0e0e0;

}



.craft-header-left {

    display:flex;

    align-items:center;

    gap:12px;

}



.craft-logo {

    width:40px;

    height:40px;

    border-radius:6px;

    background:#d71920;

    color:#ffffff;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:12px;

    font-weight:700;

    overflow:hidden;

}



.craft-logo img {

    width:100%;

    height:100%;

    object-fit:contain;

}



.craft-course-title {

    font-size:16px;

    font-weight:700;

    color:#222;

}



.craft-scene-counter {

    font-size:12px;

    color:#777;

}



.craft-actions {

    display:flex;

    align-items:center;

    gap:18px;

}



.craft-icon-btn {

    font-size:18px;

    color:#777;

    cursor:pointer;

    user-select:none;

}



.craft-progress-track {

    height:4px;

    flex-shrink:0;

    background:#eee;

}



.craft-progress-fill {

    height:100%;

    width:0%;

    background:#d71920;

    transition:width 0.3s ease;

}



.craft-player-stage {

    position:relative;

    flex:1;

    overflow:hidden;

    background:#111;

}



.craft-player-footer {

    height:64px;

    flex-shrink:0;

    display:flex;

    align-items:center;

    justify-content:space-between;

    padding:0 20px;

    background:#ffffff;

    border-top:1px solid #e0e0e0;

}



.craft-nav-btn {

    font-size:14px;

    font-weight:600;

    padding:10px 20px;

    border-radius:8px;

    border:1px solid #ccc;

    background:#ffffff;

    color:#333;

    cursor:pointer;

}



.craft-nav-btn:disabled {

    opacity:0.35;

    cursor:default;

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

    gap:14px;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:999px;

    padding:10px 24px 10px 10px;

    box-shadow:
    0 4px 12px rgba(0,0,0,0.3);

}



.speaker-avatar {

    width:88px;

    height:88px;

    flex-shrink:0;

    border-radius:50%;

    overflow:hidden;

    border:3px solid #d71920;

    background:#f5f5f5;

    display:flex;

    align-items:center;

    justify-content:center;

}



.speaker-avatar img {

    width:88px;

    height:88px;

    object-fit:cover;

    display:block;

}



.speaker-avatar svg {

    width:36px;

    height:36px;

}



.speaker-name {

    font-size:24px;

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
