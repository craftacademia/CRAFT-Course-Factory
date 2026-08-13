path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/routes/scorm.js'

new_content = '''import express from 'express';
import ScormBuilder from '../providers/rendering/scorm/scormBuilder.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const builder = new ScormBuilder();

router.post('/export', async (req, res) => {

    try {

        const { buildId, version, title } = req.body;

        if (!buildId) {
            return res.status(400).json({ error: 'buildId is required' });
        }

        const outputDir  = path.resolve('output');
        const html5Dir   = path.join(outputDir, buildId, 'html5');
        const scormOutDir = path.join(outputDir, buildId, 'scorm');

        if (!fs.existsSync(html5Dir)) {
            return res.status(404).json({ error: 'Build not found: ' + buildId });
        }

        const zipPath = await builder.build(
            html5Dir,
            scormOutDir,
            title || 'CRAFT Course',
            version || '1.2'
        );

        const safeTitle = (title || 'course')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_');

        res.download(zipPath, safeTitle + '_scorm.zip', err => {
            if (err) console.error('SCORM download error:', err);
        });

    } catch (error) {
        console.error('SCORM export error:', error);
        res.status(500).json({ error: error.message });
    }

});

export default router;
'''

with open(path, 'w') as f:
    f.write(new_content)

print('Done')
