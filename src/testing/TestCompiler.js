import fs from "fs/promises";
import path from "path";

export default class TestCompiler {

    constructor(projectPath) {

        this.projectPath = path.resolve(projectPath);

        this.scriptPath = path.join(
            this.projectPath,
            "Script",
            "Course Script.txt"
        );

        this.imagesPath = path.join(
            this.projectPath,
            "Images"
        );

        this.audioPath = path.join(
            this.projectPath,
            "Audio"
        );

        this.brandingPath = path.join(
            this.projectPath,
            "Branding"
        );

        this.outputPath = path.join(
            this.projectPath,
            "Output"
        );

    }

    async exists(file) {

        try {

            await fs.access(file);

            console.log("FOUND:", file);

            return true;

        } catch (error) {

            console.log("MISSING:", file);
            console.log(error);

            return false;

        }

    }

    async validate() {

        console.log("\nProject Path:", this.projectPath);
        console.log("Script Path :", this.scriptPath);
        console.log("Images Path :", this.imagesPath);
        console.log("Audio Path  :", this.audioPath);
        console.log("Branding Path:", this.brandingPath);

        const checks = {

            script: await this.exists(this.scriptPath),
            images: await this.exists(this.imagesPath),
            audio: await this.exists(this.audioPath),
            branding: await this.exists(this.brandingPath)

        };

        if (!checks.script)
            throw new Error(`Missing Script:\n${this.scriptPath}`);

        if (!checks.images)
            throw new Error(`Missing Images folder`);

        if (!checks.audio)
            throw new Error(`Missing Audio folder`);

        if (!checks.branding)
            throw new Error(`Missing Branding folder`);

        await fs.mkdir(
            this.outputPath,
            {
                recursive: true
            }
        );

        return checks;

    }

    async loadScript() {

        return fs.readFile(
            this.scriptPath,
            "utf8"
        );

    }

}