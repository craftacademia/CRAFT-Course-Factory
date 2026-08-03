import fs from "fs/promises";
import path from "path";

const projectPath = process.argv[2];

if (!projectPath) {
    console.error("Usage: node scripts/testBuild.js <project-folder>");
    process.exit(1);
}

async function exists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function main() {

    console.log("\n=== CRAFT Course Factory Test Build ===\n");

    const script = path.join(projectPath, "Script", "Course Script.txt");
    const images = path.join(projectPath, "Images");
    const audio = path.join(projectPath, "Audio");
    const branding = path.join(projectPath, "Branding");
    const output = path.join(projectPath, "Output");

    console.log("Project :", projectPath);
    console.log("Script  :", await exists(script) ? "✓" : "✗");
    console.log("Images  :", await exists(images) ? "✓" : "✗");
    console.log("Audio   :", await exists(audio) ? "✓" : "✗");
    console.log("Branding:", await exists(branding) ? "✓" : "✗");

    await fs.mkdir(output, { recursive: true });

    console.log("\nOutput folder ready:");
    console.log(output);

    console.log("\nNext step: integrate compiler.");

}

main().catch(err => {
    console.error(err);
    process.exit(1);
});