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
        cb(null, `${Date.now()}-${file.originalname}`);
    }

});


const upload = multer({
    storage
});


app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json({
    limit:"50mb"
}));

app.use(express.urlencoded({
    limit:"50mb",
    extended:true
}));


app.use(
    "/api/scorm",
    scormRouter
);



app.post(
    "/api/build",
    upload.fields([
        {
            name:"script",
            maxCount:1
        },
        {
            name:"images",
            maxCount:50
        },
        {
            name:"narration",
            maxCount:50
        },
        {
            name:"dialogueAudio",
            maxCount:50
        },
        {
            name:"backgroundMusic",
            maxCount:5
        },
        {
            name:"logo",
            maxCount:1
        }
    ]),
    async(req,res)=>{

        try {

            const scriptFile =
                req.files?.script?.[0];


            if(!scriptFile){

                return res.status(400).json({
                    error:"Missing script file (.docx)"
                });

            }


            const buildId =
                `build_${Date.now()}`;


            const buildDir =
                path.join(
                    outputDir,
                    buildId
                );


            const assetsDir =
                path.join(
                    buildDir,
                    "assets"
                );


            const folders = [
                "images",
                "audio/narration",
                "audio/dialogue",
                "audio/background",
                "branding"
            ];


            folders.forEach(folder=>{

                fs.mkdirSync(
                    path.join(
                        assetsDir,
                        folder
                    ),
                    {
                        recursive:true
                    }
                );

            });



            const assetManifest = {

                buildId,

                images:[],

                audio:{
                    narration:[],
                    dialogue:[],
                    background:[]
                },

                branding:{

                    logo:null,

                    primaryColor:
                        req.body.primaryColor || "#1e3a8a",

                    secondaryColor:
                        req.body.secondaryColor || "#f59e0b"

                }

            };



            const copyAssets =
            (
                files,
                folder,
                target
            )=>{

                if(!files) return;


                files.forEach(file=>{

                    fs.copyFileSync(
                        file.path,
                        path.join(
                            assetsDir,
                            folder,
                            file.originalname
                        )
                    );


                    target.push({

                        name:file.originalname,

                        path:
                        `assets/${folder}/${file.originalname}`

                    });

                });

            };



            copyAssets(
                req.files?.images,
                "images",
                assetManifest.images
            );


            copyAssets(
                req.files?.narration,
                "audio/narration",
                assetManifest.audio.narration
            );


            copyAssets(
                req.files?.dialogueAudio,
                "audio/dialogue",
                assetManifest.audio.dialogue
            );


            copyAssets(
                req.files?.backgroundMusic,
                "audio/background",
                assetManifest.audio.background
            );



            if(req.files?.logo?.[0]){

                const logo =
                    req.files.logo[0];


                fs.copyFileSync(
                    logo.path,
                    path.join(
                        assetsDir,
                        "branding",
                        logo.originalname
                    )
                );


                assetManifest.branding.logo = {

                    name:logo.originalname,

                    path:
                    `assets/branding/${logo.originalname}`

                };

            }



            fs.writeFileSync(
                path.join(
                    buildDir,
                    "asset-manifest.json"
                ),
                JSON.stringify(
                    assetManifest,
                    null,
                    2
                )
            );



            const compiler =
                new Compiler();


            const pir =
                await compiler.compile(
                    scriptFile.path,
                    buildDir,
                    assetManifest
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


        } catch(error){

            console.error(
                "Build Error:",
                error
            );


            return res.status(500).json({
                error:error.message
            });

        }

    }
);



app.use(
    "/api/{*splat}",
    (req,res)=>{

        res.status(404).json({
            error:
            `API route ${req.originalUrl} does not exist.`
        });

    }
);



app.listen(
    PORT,
    ()=>{
        console.log(
            `🚀 CRAFT Course Factory server active on http://localhost:${PORT}`
        );
    }
);