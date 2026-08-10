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


            // HOTSPOT_ITEM_INLINE
            // Handle inline tags: [TAG attrs]content[/TAG] all on one line.
            // tagRegex only matches pure-tag lines so inline patterns would
            // otherwise be lost. Split into OPEN_TAG + TEXT + CLOSE_TAG.
            const inlineMatch = text.match(
                /^(\[[A-Z_][A-Z0-9_]*[^\]]*\])(.+?)(\[\/[A-Z_][A-Z0-9_]*\])$/
            );

            if (inlineMatch) {

                const parsedOpen = this.tagParser.parse(inlineMatch[1]);
                const innerText  = inlineMatch[2].trim();
                const closeName  = inlineMatch[3].replace('[/', '').replace(']', '').trim();

                tokens.push({ type: 'OPEN_TAG',  line: line.number, name: parsedOpen.tag, attributes: parsedOpen.attributes });
                if (innerText) tokens.push({ type: 'TEXT', line: line.number, value: innerText });
                tokens.push({ type: 'CLOSE_TAG', line: line.number, name: closeName });

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
                    currentContext?.name === "OPTION" ||
                    currentContext?.name === "HOTSPOT_ITEM"
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