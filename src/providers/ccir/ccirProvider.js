import DialogueBuilder from "./builders/dialogueBuilder.js";


export default class CCIRProvider {


    constructor() {

        this.dialogueBuilder =
            new DialogueBuilder();

    }



    async build(
        ast,
        assetManifest = null
    ) {


        const dialogues =
            this.dialogueBuilder.build(
                ast
            );


        const ccir = {

            version:"1.0",

            generatedAt:
            new Date().toISOString(),


            course:{

                id:null,

                title:
                this.findTitle(ast),

                version:null

            },


            screens:
            this.buildScreens(
                ast,
                assetManifest
            ),


            metadata:{

                dialogues

            },


            assets:
            assetManifest ??
            {

                images:[],

                audio:{},

                branding:null

            },


            interactions:
            [],


            lookup:{

                characters:{},

                locations:{},

                assets:{},

                variables:{},

                screens:{},

                interactions:{},

                assessments:{}

            }

        };


        return ccir;

    }



    findTitle(ast) {

        let title = null;


        const walk =
        (node)=>{

            if (!node) {

                return;

            }


            if (
                node.type === "COURSE" &&
                node.attributes?.TITLE
            ) {

                title =
                node.attributes.TITLE;

            }


            for (
                const child of node.children ?? []
            ) {

                walk(child);

            }

        };


        walk(ast);


        return title;

    }



    buildScreens(
        ast,
        assetManifest
    ) {


        const screens = [];


        const imageAsset =
            assetManifest?.images?.[0] ?? null;



        const walk =
        (node)=>{

            if (!node) {

                return;

            }



            if (
                node.type === "SCENE" ||
                node.type === "SCREEN"
            ) {


                screens.push({

                    id:
                    node.attributes?.id ??
                    node.attributes?.ID ??
                    null,


                    title:
                    node.attributes?.title ??
                    node.attributes?.TITLE ??
                    "",


                    assetRef:
                    imageAsset,


                    children:
                    node.children ?? []

                });

            }


            for (
                const child of node.children ?? []
            ) {

                walk(child);

            }

        };


        walk(ast);


        return screens;

    }

}