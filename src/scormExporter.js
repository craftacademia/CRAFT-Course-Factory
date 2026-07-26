import AdmZip from "adm-zip";

export async function exportScormPackage(courseData = {}, version = "2004") {

    const zip = new AdmZip();

    const title =
        courseData.title ??
        courseData.course?.title ??
        "Untitled Course";


    const manifestXml =
        version === "1.2"
            ? generateScorm12Manifest(title)
            : generateScorm2004Manifest(title);


    const indexHtml = generateCourseHtml(courseData);


    zip.addFile(
        "imsmanifest.xml",
        Buffer.from(manifestXml, "utf-8")
    );

    zip.addFile(
        "index.html",
        Buffer.from(indexHtml, "utf-8")
    );


    return zip.toBuffer();

}


function generateScorm2004Manifest(title) {

return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.craftcourse.scorm2004" version="1.0">
<metadata>
<schema>ADL SCORM</schema>
<schemaversion>2004 4th Edition</schemaversion>
</metadata>
<organizations default="org_1">
<organization identifier="org_1">
<title>${escapeXml(title)}</title>
<item identifier="item_1" identifierref="res_1">
<title>${escapeXml(title)}</title>
</item>
</organization>
</organizations>
<resources>
<resource identifier="res_1" type="webcontent" href="index.html">
<file href="index.html"/>
</resource>
</resources>
</manifest>`;

}


function generateScorm12Manifest(title) {

return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.craftcourse.scorm12" version="1.0">
<metadata>
<schema>ADL SCORM</schema>
<schemaversion>1.2</schemaversion>
</metadata>
<organizations default="org_1">
<organization identifier="org_1">
<title>${escapeXml(title)}</title>
<item identifier="item_1" identifierref="res_1">
<title>${escapeXml(title)}</title>
</item>
</organization>
</organizations>
<resources>
<resource identifier="res_1" type="webcontent" href="index.html">
<file href="index.html"/>
</resource>
</resources>
</manifest>`;

}


function generateCourseHtml(courseData) {

return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeXml(courseData.title ?? "Course")}</title>
</head>
<body>
<h1>${escapeXml(courseData.title ?? "Untitled Course")}</h1>
<p>CRAFT SCORM Course</p>
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