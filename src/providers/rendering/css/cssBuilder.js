import fs from "fs/promises";

export default class CssBuilder {

  async build(outputFile) {

    const css = `
html,body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    font-family:Arial,sans-serif;
    background:#f5f5f5;
}

#app{
    width:100%;
    min-height:100vh;
}
`;

    await fs.writeFile(outputFile, css, "utf8");

  }

}
