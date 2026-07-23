import fs from "fs/promises";

export default class RuntimeBuilder {

  async build(outputFile) {

    const runtime = `
(function(){

    console.log("CRA.F.T Runtime Started");

    console.log(window.PIR);

})();
`;

    await fs.writeFile(
      outputFile,
      runtime,
      "utf8"
    );

  }

}