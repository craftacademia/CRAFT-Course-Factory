import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import Provider from "../../../core/provider.js";

export default class WordReaderProvider extends Provider {

    constructor() {
        super("word-reader");
    }


    async read(filePath) {

        const extension =
            path.extname(filePath)
                .toLowerCase();


        if (extension === ".txt") {

            return await fs.readFile(
                filePath,
                "utf-8"
            );

        }


        if (extension === ".docx") {

            const result =
                await mammoth.extractRawText({
                    path: filePath
                });

            return result.value;

        }


        throw new Error(
            `Unsupported file format: ${extension}`
        );

    }

}