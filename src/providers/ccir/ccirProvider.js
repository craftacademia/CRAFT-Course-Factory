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



    attr(
        node,
        lowerKey,
        upperKey
    ) {

        return (
            node.attributes?.[lowerKey] ??
            node.attributes?.[upperKey] ??
            null
        );

    }



    buildOptionsFromBranchPoint(
        branchPointNode
    ) {

        return (branchPointNode.children ?? [])
            .filter(
                child =>
                child.type === "OPTION"
            )
            .map(
                optionNode => {

                    const textNode =
                        (optionNode.children ?? [])
                        .find(
                            child =>
                            child.type === "TEXT"
                        );


                    return {

                        text:
                        (textNode?.value ?? "").trim(),


                        letter:
                        this.attr(optionNode, "letter", "LETTER"),


                        score:
                        this.attr(optionNode, "score", "SCORE"),


                        voiceId:
                        this.attr(optionNode, "vo_id", "VO_ID"),


                        next:
                        this.attr(optionNode, "next", "NEXT"),


                        // Only meaningful for HOTSPOT-style screens, where
                        // each option is a document image to click, not a
                        // text button.
                        assetRef:
                        this.attr(optionNode, "asset_ref", "ASSET_REF")

                    };

                }
            );

    }



    branchingStyleForScreenType(
        screenType
    ) {

        const normalized =
            (screenType ?? "")
                .toUpperCase();


        if (normalized === "MCQ") {

            return "mcq";

        }


        if (normalized === "HOTSPOT") {

            return "hotspot";

        }


        return "instant";

    }



    collectScreenNodes(
        node,
        results
    ) {

        if (!node) {
            return;
        }


        if (
            node.type === "SCENE" ||
            node.type === "SCREEN"
        ) {

            results.push(node);

            // SCREEN/SCENE nodes don't nest inside one another, so no
            // need to look further down this branch.
            return;

        }


        for (const child of node.children ?? []) {

            this.collectScreenNodes(
                child,
                results
            );

        }

    }



    buildScreens(
        ast,
        assetManifest
    ) {


        // Search at any depth, not just direct children of the root —
        // scripts may wrap all [SCREEN] tags in a [SCREENS] container,
        // and this must work whether that wrapper is present or not.
        const topLevelNodes = [];

        this.collectScreenNodes(
            ast,
            topLevelNodes
        );


        const screens = [];


        for (let index = 0; index < topLevelNodes.length; index++) {


            const node =
                topLevelNodes[index];


            const nextNode =
                topLevelNodes[index + 1] ?? null;


            const screenId =
                this.attr(node, "id", "ID");


            const nextScreenId =
                nextNode
                ? this.attr(nextNode, "id", "ID")
                : null;


            const scene =
                this.attr(node, "scene", "SCENE");


            const location =
                this.attr(node, "location", "LOCATION");


            const character =
                this.attr(node, "character", "CHARACTER");


            const tabContentNode =
                (node.children ?? [])
                .find(
                    child =>
                    child.type === "TAB_CONTENT"
                );


            const tabContent =
                tabContentNode
                ? {

                    bullets:
                    (tabContentNode.children ?? [])
                    .filter(
                        child =>
                        child.type === "BULLET"
                    )
                    .map(
                        bulletNode => {

                            const textNode =
                                (bulletNode.children ?? [])
                                .find(
                                    child =>
                                    child.type === "TEXT"
                                );


                            return (
                                textNode?.value ?? ""
                            ).trim();

                        }
                    )
                    .filter(
                        text =>
                        text.length > 0
                    )

                }
                : null;



            const branchPointNode =
                (node.children ?? [])
                .find(
                    child =>
                    child.type === "BRANCH_POINT"
                );


            const screenType =
                this.attr(node, "type", "TYPE");


            const branching =
                branchPointNode
                ? {

                    id:
                    this.attr(branchPointNode, "id", "ID") ??
                    `BP_${screenId}`,


                    style:
                    this.branchingStyleForScreenType(
                        screenType
                    ),


                    options:
                    this.buildOptionsFromBranchPoint(
                        branchPointNode
                    )

                }
                : null;


            screens.push({

                id:
                screenId,


                title:
                this.attr(node, "title", "TITLE") ?? "",


                type:
                this.attr(node, "type", "TYPE"),


                tabContent,


                // Named propRef, not assetRef, to avoid colliding with
                // presentationProvider.js's pre-existing assetRef handling,
                // which expects a resolved image object, not a raw string.
                propRef:
                this.attr(node, "asset_ref", "ASSET_REF"),


                scene,

                location,

                character,


                branching,


                nextOverride:
                null,


                children:
                node.children ?? []

            });



            const pathNodes =
                (node.children ?? [])
                .filter(
                    child =>
                    child.type === "PATH"
                );


            for (const pathNode of pathNodes) {


                screens.push({

                    id:
                    this.attr(pathNode, "id", "ID"),


                    title:
                    "",


                    type:
                    "PATH",


                    propRef:
                    null,


                    scene,

                    location,

                    character,


                    branching:
                    null,


                    nextOverride:
                    nextScreenId,


                    children:
                    pathNode.children ?? []

                });

            }

        }


        return screens;

    }

}
