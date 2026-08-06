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

    bottom:2%;

    width:auto;

    max-height:22%;

    overflow-y:auto;

    margin:0;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:16px;

    padding:14px 18px;

    z-index:10;

    box-shadow:
    0 8px 25px rgba(0,0,0,0.35);

}



.dialogue-speaker {

    font-size:18px;

    font-weight:700;

    color:#d71920;

    margin-bottom:6px;

}



.dialogue-text {

    font-size:18px;

    line-height:1.4;

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



.branch-options {

    position:absolute;

    left:10%;

    right:10%;

    bottom:32%;

    z-index:12;

    display:flex;

    flex-direction:column;

    gap:14px;

    background:#ffffff;

    border-radius:20px;

    padding:20px;

}



.branch-option-label {

    font-size:14px;

    font-weight:700;

    color:#d71920;

    text-transform:uppercase;

    letter-spacing:0.5px;

    margin-bottom:6px;

}



.branch-option {

    font-size:24px;

    font-weight:600;

    text-align:left;

    padding:20px 25px;

    border-radius:16px;

    border:3px solid #d71920;

    background:#ffffff;

    color:#222;

    cursor:pointer;

}



.branch-option:hover {

    background:#fdeceb;

}



.mcq-option {

    display:flex;

    align-items:center;

    gap:14px;

    font-size:24px;

    font-weight:600;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:16px;

    padding:18px 25px;

    margin-bottom:14px;

    cursor:pointer;

}



.mcq-option input {

    width:24px;

    height:24px;

    accent-color:#d71920;

}



.mcq-submit-btn {

    font-size:22px;

    font-weight:700;

    padding:16px 40px;

    border-radius:16px;

    border:3px solid #d71920;

    background:#d71920;

    color:#ffffff;

    cursor:pointer;

}



.mcq-submit-btn:disabled {

    opacity:0.4;

    cursor:default;

}



.branch-options--hotspot {

    flex-direction:row;

    flex-wrap:wrap;

}



.hotspot-option {

    display:inline-flex;

    flex-direction:column;

    align-items:center;

    gap:10px;

    width:180px;

    cursor:pointer;

    border:3px solid #d71920;

    border-radius:16px;

    background:#ffffff;

    padding:10px;

    margin-right:16px;

}



.hotspot-option img {

    width:100%;

    height:140px;

    object-fit:cover;

    border-radius:10px;

}



.hotspot-caption {

    font-size:16px;

    font-weight:600;

    color:#222;

    text-align:center;

}





.tab-panel {

    position:absolute;

    left:10%;

    right:10%;

    bottom:10%;

    z-index:12;

}



.tab-open-btn {

    font-size:24px;

    font-weight:700;

    padding:20px 40px;

    border-radius:16px;

    border:3px solid #d71920;

    background:#ffffff;

    color:#d71920;

    cursor:pointer;

}



.tab-panel-content {

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:16px;

    padding:25px 30px;

    max-height:60vh;

    overflow-y:auto;

}



.tab-bullet-list {

    margin:0 0 18px 0;

    padding-left:22px;

}



.tab-bullet-list li {

    font-size:20px;

    line-height:1.5;

    color:#222;

    margin-bottom:10px;

}



.tab-checkbox-label {

    display:flex;

    align-items:center;

    gap:10px;

    font-size:18px;

    font-weight:600;

    color:#222;

    cursor:pointer;

}



.tab-checkbox-label input {

    width:22px;

    height:22px;

    accent-color:#d71920;

}




.reveal-panel {

    position:absolute;

    left:10%;

    right:10%;

    top:10%;

    bottom:20%;

    z-index:12;

    display:flex;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:16px;

    overflow:hidden;

}



.reveal-sidebar {

    width:180px;

    flex-shrink:0;

    background:#f5f5f5;

    border-right:2px solid #eee;

    overflow-y:auto;

}



.reveal-tab-btn {

    display:block;

    width:100%;

    text-align:left;

    font-size:16px;

    font-weight:600;

    padding:16px 18px;

    border:none;

    border-bottom:1px solid #eee;

    background:transparent;

    color:#555;

    cursor:pointer;

}



.reveal-tab-btn.active {

    background:#d71920;

    color:#ffffff;

}



.reveal-tab-btn:disabled {

    color:#bbb;

    cursor:default;

}



.reveal-content {

    flex:1;

    padding:25px 30px;

    overflow-y:auto;

}



.reveal-content-icon {

    width:64px;

    height:64px;

    object-fit:contain;

    margin-bottom:14px;

}



.reveal-content-title {

    font-size:22px;

    font-weight:700;

    color:#d71920;

    margin:0 0 10px 0;

}



.reveal-content-text {

    font-size:18px;

    line-height:1.5;

    color:#222;

    margin:0;

}



.reveal-checkbox-wrap {

    position:absolute;

    left:10%;

    right:10%;

    bottom:8%;

    z-index:13;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:16px;

    padding:14px 20px;

}




.dragdrop-panel {

    position:absolute;

    left:5%;

    right:5%;

    top:8%;

    bottom:8%;

    z-index:12;

    display:flex;

    flex-direction:column;

    gap:16px;

    background:#ffffff;

    border-radius:20px;

    padding:20px;

}



.dragdrop-tray {

    display:flex;

    flex-wrap:wrap;

    gap:14px;

    justify-content:center;

    padding:14px;

    background:rgba(255,255,255,0.6);

    border-radius:16px;

    min-height:110px;

}



.dragdrop-card {

    width:130px;

    height:110px;

    touch-action:none;

    cursor:grab;

    user-select:none;

}



.dragdrop-card img {

    width:100%;

    height:100%;

    object-fit:contain;

    display:block;

    pointer-events:none;

}



.dragdrop-card--dragging {

    z-index:50;

    cursor:grabbing;

    filter:drop-shadow(0 8px 14px rgba(0,0,0,0.35));

}



.dragdrop-card--correct img {

    outline:4px solid #2e9e4f;

    border-radius:8px;

}



.dragdrop-card--incorrect img {

    outline:4px solid #d71920;

    border-radius:8px;

}



.dragdrop-card--locked {

    cursor:default;

}



.dragdrop-zones {

    display:flex;

    gap:16px;

    flex:1;

}



.dragdrop-zone {

    flex:1;

    display:flex;

    flex-direction:column;

    border-radius:16px;

    padding:12px;

    border:3px solid;

}



.dragdrop-zone--green {

    border-color:#2e9e4f;

    background:rgba(46,158,79,0.08);

}



.dragdrop-zone--red {

    border-color:#d71920;

    background:rgba(215,25,32,0.08);

}



.dragdrop-zone-label {

    font-size:16px;

    font-weight:700;

    text-align:center;

    color:#222;

    margin-bottom:10px;

}



.dragdrop-zone-dropspace {

    flex:1;

    display:flex;

    flex-wrap:wrap;

    gap:10px;

    justify-content:center;

    align-content:flex-start;

}



.dragdrop-submit-btn {

    align-self:center;

    font-size:20px;

    font-weight:700;

    padding:14px 40px;

    border-radius:16px;

    border:3px solid #d71920;

    background:#d71920;

    color:#ffffff;

    cursor:pointer;

}



.dragdrop-submit-btn:disabled {

    opacity:0.4;

    cursor:default;

}




.craft-score-display {

    font-size:14px;

    font-weight:700;

    color:#d71920;

    background:#fdeceb;

    padding:6px 16px;

    border-radius:999px;

    border:1px solid #d71920;
}




.score-checkpoint-panel {

    position:absolute;

    left:15%;

    right:15%;

    bottom:30%;

    z-index:12;

    background:#ffffff;

    border:3px solid #d71920;

    border-radius:16px;

    padding:20px 30px;

    text-align:center;

}



.score-checkpoint-module-name {

    font-size:20px;

    font-weight:700;

    color:#222;

    margin-bottom:8px;

}



.score-checkpoint-module-score {

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
