import fs from "fs/promises";

export default class RuntimeBuilder {

    async build(outputFile) {

        const runtime = `
import BrowserRuntime from "./browserRuntime.js";

document.addEventListener("DOMContentLoaded", () => {

    if (!window.PIR) {
        console.error("PIR not found.");
        return;
    }

    const runtime = new BrowserRuntime(window.PIR);

    runtime.play();

    window.courseRuntime = runtime;

    console.log("C.R.A.F.T Runtime Started");

});
`;

        await fs.writeFile(
            outputFile,
            runtime,
            "utf8"
        );

        return outputFile;

    }

}