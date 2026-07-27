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


        if (assetManifest) {

            pir.assets =
                assetManifest;

        }


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
            JSON.stringify(
                ccir,
                null,
                2
            )
        );


        await fs.writeFile(
            path.join(
                outputDirectory,
                "pir.json"
            ),
            JSON.stringify(
                pir,
                null,
                2
            )
        );


        await this.renderer.render(
            pir,
            path.join(
                outputDirectory,
                "preview"
            )
        );


        return pir;

    }

}