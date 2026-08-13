path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/assets/assetBundler.js'

new_content = '''import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

let sharp = null;
try { sharp = require("sharp"); } catch(e) {}

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_WIDTH  = 1280;
const QUALITY    = 82;

export default class AssetBundler {

    async build(assets = [], outputDirectory) {

        const outputAssetsDirectory = path.join(outputDirectory, "assets");
        await fs.mkdir(outputAssetsDirectory, { recursive: true });

        const bundledAssets = [];

        for (const asset of assets) {

            if (!asset?.src) continue;

            const fileName    = path.basename(asset.src);
            const destination = path.join(outputAssetsDirectory, fileName);
            const ext         = path.extname(fileName).toLowerCase();

            if (sharp && IMAGE_EXTS.has(ext)) {
                try {
                    await sharp(asset.src)
                        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                        .jpeg({ quality: QUALITY, progressive: true })
                        .toFile(destination.replace(/\\.(png|webp)$/i, '.jpg'));

                    const compressedName = fileName.replace(/\\.(png|webp)$/i, '.jpg');
                    bundledAssets.push({
                        id:   asset.id ?? compressedName,
                        name: compressedName,
                        type: asset.type,
                        path: `assets/${compressedName}`,
                        src:  `assets/${compressedName}`,
                        bundledPath: `assets/${compressedName}`
                    });
                    continue;
                } catch(e) {
                    // Fall through to plain copy if sharp fails
                }
            }

            await fs.copyFile(asset.src, destination);

            bundledAssets.push({
                id:   asset.id ?? fileName,
                name: asset.name ?? fileName,
                type: asset.type,
                path: `assets/${fileName}`,
                src:  `assets/${fileName}`,
                bundledPath: `assets/${fileName}`
            });

        }

        return bundledAssets;

    }

}
'''

with open(path, 'w') as f:
    f.write(new_content)

print('Done')
