import fs from "fs/promises";

export default class CssBuilder {

    async build(outputFile) {

        const css = `
*{
    box-sizing:border-box;
}

html,
body{
    margin:0;
    padding:0;
    width:100%;
    min-height:100%;
    font-family:Arial,sans-serif;
    background:#f5f5f5;
    color:#222;
}

body{
    overflow-x:hidden;
}

#app{
    width:100%;
    min-height:100vh;
}

.page{
    width:100%;
    min-height:100vh;
}

.hidden{
    display:none !important;
}

button{
    cursor:pointer;
}

img,
video{
    max-width:100%;
    height:auto;
}

input,
textarea,
select,
button{
    font:inherit;
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