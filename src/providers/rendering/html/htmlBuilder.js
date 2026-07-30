import fs from "fs/promises";
import path from "path";


export default class HtmlBuilder {


    async build(
        pir,
        outputDirectory
    ) {


        await fs.mkdir(
            outputDirectory,
            {
                recursive: true
            }
        );


        const dataDirectory =
            path.join(
                outputDirectory,
                "data"
            );


        await fs.mkdir(
            dataDirectory,
            {
                recursive: true
            }
        );


        const html = `<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>
${pir?.course?.title ?? "C.R.A.F.T Course"}
</title>


<style>

body {

    margin:0;
    font-family:Arial, sans-serif;
    background:#f5f5f5;

}


#app {

    min-height:100vh;
    padding:40px;

}


.dialogue {

    background:white;
    padding:20px;
    margin:20px auto;
    max-width:800px;
    border-radius:12px;
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
    font-size:22px;

}

</style>

</head>


<body>


<div id="app"></div>


<script>

window.PIR =
${JSON.stringify(pir, null, 2)};


window.CRAFT_AUDIO =
${JSON.stringify(
    pir?.audio ??
    pir?.assets?.audio ??
    {},
    null,
    2
)};


window.CRAFT_CONFIG =
${JSON.stringify(
    {
        audio:
            pir?.audio ??
            pir?.assets?.audio ??
            {},
        assets:
            pir?.assets ?? {}
    },
    null,
    2
)};

</script>


<script type="module" src="runtime.js"></script>


</body>

</html>`;


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
                pir,
                null,
                2
            ),
            "utf8"
        );


        return outputDirectory;

    }


}