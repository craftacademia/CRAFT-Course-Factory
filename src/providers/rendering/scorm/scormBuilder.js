import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);


export default class ScormBuilder {


    async build(
        html5Directory,
        outputDirectory
    ) {

        await fs.mkdir(
            outputDirectory,
            {
                recursive:true
            }
        );


        const scormDirectory =
            path.join(
                outputDirectory,
                "package"
            );


        await fs.mkdir(
            scormDirectory,
            {
                recursive:true
            }
        );


        await this.copyDirectory(
            html5Directory,
            scormDirectory
        );


        await this.createManifest(
            scormDirectory
        );


        const zipFile =
            path.resolve(
                outputDirectory,
                "course-scorm.zip"
            );


        await execFileAsync(
            "zip",
            [
                "-r",
                zipFile,
                "."
            ],
            {
                cwd: scormDirectory
            }
        );


        return zipFile;

    }



    async createManifest(directory) {

        const manifest = `<?xml version="1.0" encoding="UTF-8"?>

<manifest
identifier="CRAFT_COURSE"
version="1.2"
xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">

<organizations default="ORG1">

<organization identifier="ORG1">

<title>CRAFT Course</title>

<item identifier="ITEM1" identifierref="RES1">

<title>Course</title>

</item>

</organization>

</organizations>


<resources>

<resource
identifier="RES1"
type="webcontent"
adlcp:scormtype="sco"
href="index.html">

<file href="index.html"/>

<file href="runtime.js"/>

<file href="styles.css"/>

</resource>

</resources>

</manifest>`;


        await fs.writeFile(
            path.join(
                directory,
                "imsmanifest.xml"
            ),
            manifest,
            "utf8"
        );

    }



    async copyDirectory(
        source,
        destination
    ) {

        await fs.mkdir(
            destination,
            {
                recursive:true
            }
        );


        const entries =
            await fs.readdir(
                source,
                {
                    withFileTypes:true
                }
            );


        for (const entry of entries) {

            const src =
                path.join(
                    source,
                    entry.name
                );


            const dest =
                path.join(
                    destination,
                    entry.name
                );


            if (entry.isDirectory()) {

                await this.copyDirectory(
                    src,
                    dest
                );

            }
            else {

                await fs.copyFile(
                    src,
                    dest
                );

            }

        }

    }

}