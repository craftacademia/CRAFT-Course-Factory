import express from "express";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { fileURLToPath } from "url";

const app =
    express();


const __filename =
    fileURLToPath(
        import.meta.url
    );


const __dirname =
    path.dirname(
        __filename
    );


const PORT =
    5173;


const outputDirectory =
    path.join(
        __dirname,
        "output"
    );


function latestBuild() {

    return fs.readdirSync(
        outputDirectory
    )
    .filter(
        item =>
        item.startsWith("build_")
    )
    .sort()
    .reverse()[0];

}


app.use(
    express.static(
        outputDirectory
    )
);


app.use(
    "/assets",
    (req, res, next) => {

        const build =
            latestBuild();


        if (!build) {

            return next();

        }


        const assetPath =
            path.join(
                outputDirectory,
                build,
                "assets",
                req.path
            );


        if (
            fs.existsSync(assetPath)
        ) {

            res.type(
                mime.lookup(assetPath) ||
                "application/octet-stream"
            );


            return res.sendFile(
                assetPath
            );

        }


        next();

    }
);


app.use(
    (req, res) => {

        const build =
            latestBuild();


        if (!build) {

            return res.status(404).send(
                "No build found"
            );

        }


        res.sendFile(
            path.join(
                outputDirectory,
                build,
                "preview",
                "index.html"
            )
        );

    }
);


app.listen(
    PORT,
    () => {

        console.log(
            `Preview Server running at http://localhost:${PORT}`
        );

    }
);