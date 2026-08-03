import fs from "fs/promises";
import path from "path";

import WordReaderProvider from "../providers/readers/word/wordReaderProvider.js";
import DocumentFormatterProvider from "../providers/documentFormatter/documentFormatterProvider.js";
import LexerProvider from "../providers/lexer/lexerProvider.js";
import ParserProvider from "../providers/parser/parserProvider.js";
import ValidatorProvider from "../providers/validator/validatorProvider.js";
import SemanticProvider from "../providers/semantic/semanticProvider.js";
import CCIRProvider from "../providers/ccir/ccirProvider.js";
import PresentationProvider from "../providers/presentation/presentationProvider.js";
import RendererProvider from "../providers/rendering/rendererProvider.js";

import AttributeNormalizer from "./normalizers/attributeNormalizer.js";


function safeStringify(object) {

    const seen = new WeakSet();


    return JSON.stringify(
        object,
        (key, value) => {

            if (key === "parent") {

                return undefined;

            }


            if (
                typeof value === "object" &&
                value !== null
            ) {

                if (seen.has(value)) {

                    return undefined;

                }


                seen.add(value);

            }


            return value;

        },
        2
    );

}



function cloneForSerialization(object) {

    return JSON.parse(
        JSON.stringify(
            object,
            (key, value) => {

                if (
                    key === "voice"
                ) {

                    return undefined;

                }

                return value;

            }
        )
    );

}



export default class Compiler {


    constructor() {

        this.reader =
            new WordReaderProvider();

        this.formatter =
            new DocumentFormatterProvider();

        this.lexer =
            new LexerProvider();

        this.parser =
            new ParserProvider();

        this.attributeNormalizer =
            new AttributeNormalizer();

        this.validator =
            new ValidatorProvider();

        this.semantic =
            new SemanticProvider();

        this.ccirProvider =
            new CCIRProvider();

        this.presentationProvider =
            new PresentationProvider();

        this.renderer =
            new RendererProvider();

    }



    async compile(
        inputFile,
        outputDirectory = "./build",
        assetManifest = null
    ) {


        const raw =
            await this.reader.read(
                inputFile
            );


        const formatted =
            await this.formatter.format(
                raw
            );


        const tokens =
            await this.lexer.lex(
                formatted
            );


        const ast =
            await this.parser.parse(
                tokens
            );


        await fs.writeFile(
            "ast-debug.json",
            safeStringify(ast)
        );


        this.attributeNormalizer.normalize(
            ast
        );


        await this.validator.validate(
            ast
        );


        await this.semantic.validate(
            ast
        );


        const ccir =
            await this.ccirProvider.build(
                ast,
                assetManifest
            );


        const pir =
            await this.presentationProvider.build(
                ccir
            );


        await fs.mkdir(
            outputDirectory,
            {
                recursive:true
            }
        );


        await fs.writeFile(
            path.join(
                outputDirectory,
                "ccir.json"
            ),
            safeStringify(ccir)
        );


        await fs.writeFile(
            path.join(
                outputDirectory,
                "pir.json"
            ),
            safeStringify(
                cloneForSerialization(pir)
            )
        );


        const previewDirectory =
            path.join(
                outputDirectory,
                "preview"
            );


        await this.renderer.render(
            pir,
            previewDirectory
        );


        await this.renderer.buildHtml5Artifact(
            pir,
            path.join(
                outputDirectory,
                "html5"
            )
        );


        return pir;

    }

}