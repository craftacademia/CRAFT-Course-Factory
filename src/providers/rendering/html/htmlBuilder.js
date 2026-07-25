import fs from "fs/promises";
import path from "path";

import CourseRenderer from "./courseRenderer.js";

export default class HtmlBuilder {

    constructor() {

        this.courseRenderer = new CourseRenderer();

    }

    async build(pir, outputDirectory) {

        await fs.mkdir(outputDirectory, {
            recursive: true
        });

        const body = this.courseRenderer.render(pir);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>${pir?.course?.title ?? "C.R.A.F.T Course"}</title>

<link rel="stylesheet" href="styles.css">

</head>

<body>

<div id="app">

${body}

</div>

<script>

window.PIR = ${JSON.stringify(pir, null, 2)};

</script>

<script type="module" src="runtime.js"></script>

</body>

</html>`;

        await fs.writeFile(
            path.join(outputDirectory, "index.html"),
            html,
            "utf8"
        );

        return path.join(outputDirectory, "index.html");

    }

}