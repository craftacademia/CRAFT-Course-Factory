import Provider from "../../core/provider.js";
import TagAttributeParser from "../tagParser/tagAttributeParser.js";


export default class LexerProvider extends Provider {


    constructor() {

        super("lexer");

        this.tagParser =
            new TagAttributeParser();

    }



    async lex(lines) {


        const tokens = [];


        const tagRegex =
            /^\[(\/?)[A-Z_][A-Z0-9_]*.*\]$/;


        let courseCreated = false;

        let screenOpen = false;



        for (const line of lines) {


            const text =
                line.text.trim();



            if (!text) {
                continue;
            }



            if (tagRegex.test(text)) {


                const closing =
                    text.startsWith("[/");



                if (closing) {


                    const name =
                        text
                        .replace("[/", "")
                        .replace("]", "")
                        .trim();



                    tokens.push({

                        type:
                        "CLOSE_TAG",

                        line:
                        line.number,

                        name

                    });



                    continue;

                }



                const parsed =
                    this.tagParser.parse(text);



                tokens.push({

                    type:
                    "OPEN_TAG",

                    line:
                    line.number,

                    name:
                    parsed.tag,

                    attributes:
                    parsed.attributes

                });



                continue;

            }



            const currentContext =
                tokens[tokens.length - 1];



            if (
                currentContext?.type === "OPEN_TAG" &&
                (
                    currentContext?.name === "LINE" ||
                    currentContext?.name === "OPTION"
                )
            ) {


                tokens.push({

                    type:
                    "TEXT",

                    line:
                    line.number,

                    value:
                    line.text

                });



                continue;

            }



            if (!courseCreated) {


                courseCreated = true;



                tokens.push({

                    type:
                    "OPEN_TAG",

                    line:
                    line.number,

                    name:
                    "COURSE",

                    attributes:{

                        title:
                        text

                    }

                });



                continue;

            }



            if (/^Module\s+\d+\s*:/i.test(text)) {


                if (screenOpen) {

                    tokens.push({

                        type:
                        "CLOSE_TAG",

                        line:
                        line.number,

                        name:
                        "SCREEN"

                    });

                }



                screenOpen = true;



                tokens.push({

                    type:
                    "OPEN_TAG",

                    line:
                    line.number,

                    name:
                    "SCREEN",

                    attributes:{

                        title:
                        text.replace(/^Module\s+\d+\s*:/i,"").trim()

                    }

                });



                continue;

            }



            if (/^Audio\s*:/i.test(text)) {


                tokens.push({

                    type:
                    "OPEN_TAG",

                    line:
                    line.number,

                    name:
                    "DIALOGUE",

                    attributes:{}

                });



                tokens.push({

                    type:
                    "TEXT",

                    line:
                    line.number,

                    value:
                    text.replace(/^Audio\s*:/i,"").trim()

                });



                tokens.push({

                    type:
                    "CLOSE_TAG",

                    line:
                    line.number,

                    name:
                    "DIALOGUE"

                });



                continue;

            }



            tokens.push({

                type:
                "TEXT",

                line:
                line.number,

                value:
                line.text

            });

        }



        if (screenOpen) {

            tokens.push({

                type:
                "CLOSE_TAG",

                line:
                lines.length + 1,

                name:
                "SCREEN"

            });

        }



        if (courseCreated) {

            tokens.push({

                type:
                "CLOSE_TAG",

                line:
                lines.length + 2,

                name:
                "COURSE"

            });

        }



        return tokens;

    }

}