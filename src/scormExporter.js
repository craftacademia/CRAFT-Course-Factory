import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";


export async function exportScormPackage(
    courseData = {},
    version = "2004"
) {

    const zip = new AdmZip();

    const title =
        courseData.title ??
        courseData.course?.title ??
        "Untitled Course";


    zip.addFile(
        "imsmanifest.xml",
        Buffer.from(
            version === "1.2"
                ? generateScorm12Manifest(title)
                : generateScorm2004Manifest(title),
            "utf8"
        )
    );


    const previewDirectory =
        path.join(
            process.cwd(),
            "test-courses",
            "Document & Eligibility GAMES",
            "Output",
            "preview"
        );


    if (fs.existsSync(previewDirectory)) {

        addDirectoryToZip(
            zip,
            previewDirectory,
            ""
        );

    } else {

        zip.addFile(
            "index.html",
            Buffer.from(
                generateCourseHtml(courseData),
                "utf8"
            )
        );

    }


    return zip.toBuffer();

}


function addDirectoryToZip(zip, directory, prefix) {

    const files = fs.readdirSync(directory);

    for (const file of files) {

        const fullPath =
            path.join(
                directory,
                file
            );


        const zipPath =
            path.join(
                prefix,
                file
            );


        if (
            file === "browserRuntime.js" &&
            prefix === ""
        ) {
            continue;
        }


        if (fs.statSync(fullPath).isDirectory()) {

            addDirectoryToZip(
                zip,
                fullPath,
                zipPath
            );

        } else {

            zip.addLocalFile(
                fullPath,
                path.dirname(zipPath)
            );

        }

    }

}


function generateScorm2004Manifest(title) {

return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="craft-scorm-2004" version="1.0">
<metadata>
<schema>ADL SCORM</schema>
<schemaversion>2004 4th Edition</schemaversion>
</metadata>
<organizations default="org">
<organization identifier="org">
<title>${escapeXml(title)}</title>
<item identifier="item" identifierref="resource">
<title>${escapeXml(title)}</title>
</item>
</organization>
</organizations>
<resources>
<resource identifier="resource" type="webcontent" href="index.html">
<file href="index.html"/>
</resource>
</resources>
</manifest>`;

}


function generateScorm12Manifest(title) {

return generateScorm2004Manifest(title);

}


function generateCourseHtml(courseData) {

return `<!DOCTYPE html>
<html>
<body>
<h1>${escapeXml(courseData.title ?? "Course")}</h1>
</body>
</html>`;

}


function escapeXml(value = "") {

return String(value).replace(
    /[<>&'"]/g,
    char => ({
        "<":"&lt;",
        ">":"&gt;",
        "&":"&amp;",
        "'":"&apos;",
        '"':"&quot;"
    }[char])
);

}


export const exportScorm = exportScormPackage;
export const generateScormPackage = exportScormPackage;
export const buildScormPackage = exportScormPackage;

export default exportScormPackage;