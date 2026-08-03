import fs from "fs/promises";


export default class CssBuilder {


    async build(outputFile) {


        const css = `

* {
    box-sizing:border-box;
}


html,
body {

    margin:0;
    padding:0;

    width:100%;
    height:100%;

    font-family:Arial,sans-serif;

    background:#111;

}



#app {

    width:100%;
    height:100vh;

}



.craft-player {

    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;

    overflow:hidden;

}



.craft-player-header {

    height:70px;

    display:flex;
    align-items:center;
    justify-content:space-between;

    padding:0 24px;

    background:#ffffff;

    border-bottom:1px solid #ddd;

}



.craft-logo {

    font-size:26px;

    font-weight:800;

}



.craft-course-title {

    font-size:20px;

    font-weight:600;

}



.craft-actions {

    display:flex;

    gap:10px;

}



.craft-actions button,
.craft-player-footer button {

    padding:8px 18px;

    border-radius:8px;

    border:1px solid #ccc;

    background:white;

}



.craft-player-stage {

    position:relative;

    flex:1;

    overflow:hidden;

}



.image-component {

    position:absolute;

    inset:0;

    width:100%;

    height:100%;

    object-fit:contain;

    z-index:1;

}



.dialogue-box {

    position:absolute;

    left:8%;

    right:8%;

    bottom:8%;

    z-index:10;

    background:white;

    border:4px solid #1e3a8a;

    border-radius:20px;

    padding:24px;

    box-shadow:
    0 8px 25px rgba(0,0,0,0.35);

}



.dialogue-speaker {

    font-size:26px;

    font-weight:700;

    color:#1e3a8a;

    margin-bottom:10px;

}



.dialogue-text {

    font-size:28px;

    line-height:1.4;

    font-weight:600;

}



.craft-player-footer {

    height:70px;

    display:flex;

    justify-content:center;

    align-items:center;

    gap:20px;

    background:white;

    border-top:1px solid #ddd;

}



`;



        await fs.writeFile(
            outputFile,
            css,
            "utf8"
        );


        return outputFile;

    }

}