import Express from 'express';
import AdmZip from 'adm-zip';

/**
 * Generates a SCORM package (2004 or 1.2) as a ZIP buffer using adm-zip.
 */
export async function exportScormPackage(courseData = {}, res, version = '2004') {
  const zip = new AdmZip();

  const title = courseData.title || 'Untitled Course';
  const manifestXml = version === '1.2' 
    ? generateScorm12Manifest(title) 
    : generateScorm2004Manifest(title);

  const indexHtml = generateCourseHtml(courseData);

  // Add files directly to in-memory ZIP archive
  zip.addFile('imsmanifest.xml', Buffer.from(manifestXml, 'utf-8'));
  zip.addFile('index.html', Buffer.from(indexHtml, 'utf-8'));

  // Generate buffer and send
  const zipBuffer = zip.toBuffer();
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="scorm-${version}.zip"`);
  res.setHeader('Content-Length', zipBuffer.length);

  return res.send(zipBuffer);
}

function generateScorm2004Manifest(title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.craftcourse.scorm2004" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">
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
    <resource identifier="res_1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>`;
}

function generateScorm12Manifest(title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.craftcourse.scorm12" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
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
    <resource identifier="res_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>`;
}

function generateCourseHtml(courseData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(courseData.title || 'Course')}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #1a202c; }
  </style>
</head>
<body>
  <h1>${escapeXml(courseData.title || 'Untitled Course')}</h1>
  <p>Welcome to your SCORM package!</p>
</body>
</html>`;
}

function escapeXml(unsafe = '') {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export const exportScorm = exportScormPackage;
export const generateScormPackage = exportScormPackage;
export const buildScormPackage = exportScormPackage;
export default exportScormPackage;
