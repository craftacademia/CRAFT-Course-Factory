import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import Compiler from "./compiler/compiler.js";
import { generateScormPackage } from "./scormExporter.js";
import scormRouter from "./routes/scorm.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;


const uploadDir = path.join(__dirname, "../uploads");
const outputDir = path.join(__dirname, "../output");


[uploadDir, outputDir].forEach(dir => {

    if (!fs.existsSync(dir)) {

        fs.mkdirSync(dir, {
            recursive: true
        });

    }

});


const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadDir);
    },

    filename(req, file, cb) {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );
    }

});


const upload = multer({
    storage
});


app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

app.use(
    express.json({
        limit: "50mb"
    })
);

app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true
    })
);


app.use(
    "/api/scorm",
    scormRouter
);



app.post(
    "/api/build",
    upload.fields([
        {
            name: "script",
            maxCount: 1
        },
        {
            name: "assets",
            maxCount: 50
        }
    ]),
    async (req, res) => {

        try {

            const scriptFile =
                req.files?.script?.[0];


            if (!scriptFile) {

                return res.status(400).json({
                    error:
                        "Missing script file (.docx)"
                });

            }


            const buildDir =
                path.join(
                    outputDir,
                    `build_${Date.now()}`
                );


            fs.mkdirSync(
                buildDir,
                {
                    recursive: true
                }
            );


            const compiler =
                new Compiler();


            const pir =
                await compiler.compile(
                    scriptFile.path,
                    buildDir
                );


            const zipBuffer =
                await generateScormPackage(
                    pir
                );


            res.set({
                "Content-Type":
                    "application/zip",

                "Content-Disposition":
                    'attachment; filename="SCORM_Package.zip"',

                "Content-Length":
                    zipBuffer.length
            });


            return res.send(zipBuffer);


        } catch (err) {

            console.error(
                "Build Error:",
                err
            );


            return res.status(500).json({
                error:
                    err.message
            });

        }

    }
);



app.use(
    "/api/{*splat}",
    (req, res) => {

        res.status(404).json({
            error:
                `API route ${req.originalUrl} does not exist.`
        });

    }
);



app.listen(
    PORT,
    () => {

        console.log(
            `🚀 CRAFT Course Factory server active on http://localhost:${PORT}`
        );

    }
);