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



    collectScoreBranch(
        screenNode
    ) {

        const scoreBranchNode =
            (screenNode.children ?? [])
            .find(
                child =>
                child.type === "SCORE_BRANCH"
            );


        if (!scoreBranchNode) {

            return null;

        }


        const caseNodes =
            (scoreBranchNode.children ?? [])
            .filter(
                child =>
                child.type === "SCORE_CASE"
            );


        const cases =
            caseNodes.map(
                caseNode => {

                    const lineNodes =
                        (caseNode.children ?? [])
                        .filter(
                            child =>
                            child.type === "LINE"
                        );


                    const lines =
                        lineNodes.map(
                            lineNode => {

                                const textNode =
                                    (lineNode.children ?? [])
                                    .find(
                                        child =>
                                        child.type === "TEXT"
                                    );


                                return {

                                    text:
                                    (textNode?.value ?? "").trim(),

                                    speaker:
                                    this.attr(lineNode, "speaker", "SPEAKER"),

                                    voiceId:
                                    this.attr(lineNode, "vo_id", "VO_ID"),

                                    expression:
                                    this.attr(lineNode, "expression", "EXPRESSION")

                                };

                            }
                        );


                    return {

                        min:
                        Number(
                            this.attr(caseNode, "min", "MIN")
                        ) || 0,


                        max:
                        Number(
                            this.attr(caseNode, "max", "MAX")
                        ) || 0,


                        lines

                    };

                }
            );


        return {

            moduleRef:
            this.attr(scoreBranchNode, "module_ref", "MODULE_REF"),


            cases

        };

    }



    collectConditionalFeedback(
        screenNode,
        afterTypes
    ) {

        const children =
            screenNode.children ?? [];


        let markerIndex = -1;


        for (let i = 0; i < children.length; i++) {

            if (afterTypes.includes(children[i].type)) {

                markerIndex = i;

            }

        }


        if (markerIndex === -1) {

            return {

                correct: null,

                incorrect: null

            };

        }


        let correct = null;

        let incorrect = null;


        for (
            let i = markerIndex + 1;
            i < children.length;
            i++
        ) {

            const child = children[i];


            if (child.type !== "LINE") {

                continue;

            }


            const result =
                this.attr(child, "result", "RESULT");


            if (!result) {

                // A LINE with no RESULT= isn't feedback — it's regular
                // post-branch dialogue (e.g. S15's consequence lines
                // after the mismatch is corrected). Stop collecting.
                break;

            }


            const textNode =
                (child.children ?? [])
                .find(
                    grandchild =>
                    grandchild.type === "TEXT"
                );


            const line = {

                text:
                (textNode?.value ?? "").trim(),

                speaker:
                this.attr(child, "speaker", "SPEAKER"),

                voiceId:
                this.attr(child, "vo_id", "VO_ID"),

                expression:
                this.attr(child, "expression", "EXPRESSION")

            };


            if (result.toUpperCase() === "CORRECT") {

                correct = line;

            } else if (result.toUpperCase() === "INCORRECT") {

                incorrect = line;

            }

        }


        return {

            correct,

            incorrect

        };

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



            const revealTabNodes =
                (node.children ?? [])
                .filter(
                    child =>
                    child.type === "TAB_ITEM"
                );


            const revealTabs =
                revealTabNodes.length > 0
                ? revealTabNodes.map(
                    tabNode => {

                        const textNode =
                            (tabNode.children ?? [])
                            .find(
                                child =>
                                child.type === "TEXT"
                            );


                        return {

                            id:
                            this.attr(tabNode, "id", "ID"),


                            title:
                            this.attr(tabNode, "title", "TITLE") ?? "",


                            assetRef:
                            this.attr(tabNode, "asset_ref", "ASSET_REF"),


                            text:
                            (textNode?.value ?? "").trim()

                        };

                    }
                )
                : null;



            const cardNodes =
                (node.children ?? [])
                .filter(
                    child =>
                    child.type === "CARD"
                );


            const zoneNodes =
                (node.children ?? [])
                .filter(
                    child =>
                    child.type === "ZONE"
                );


            const dragDrop =
                cardNodes.length > 0
                ? {

                    cards:
                    cardNodes.map(
                        cardNode => ({

                            id:
                            this.attr(cardNode, "id", "ID"),

                            assetRef:
                            this.attr(cardNode, "asset_ref", "ASSET_REF"),

                            label:
                            this.attr(cardNode, "label", "LABEL") ?? "",

                            subtext:
                            this.attr(cardNode, "subtext", "SUBTEXT") ?? "",

                            zone:
                            this.attr(cardNode, "zone", "ZONE")

                        })
                    ),


                    zones:
                    zoneNodes.map(
                        zoneNode => ({

                            id:
                            this.attr(zoneNode, "id", "ID"),

                            label:
                            this.attr(zoneNode, "label", "LABEL") ?? "",

                            color:
                            this.attr(zoneNode, "color", "COLOR") ?? "green"

                        })
                    ),


                    // Lines that appear AFTER the last CARD/ZONE tag are
                    // post-submission feedback, not intro narration — they
                    // must not play before the interaction like regular
                    // dialogue does. Only one plays, based on whether the
                    // learner got every card right.
                    feedback:
                    this.collectConditionalFeedback(
                        node,
                        ["CARD", "ZONE"]
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


            const scoreCheckpoint =
                (screenType ?? "").toUpperCase() === "SCORE_CHECKPOINT"
                ? {

                    checkpointId:
                    this.attr(node, "checkpoint_id", "CHECKPOINT_ID"),


                    moduleName:
                    this.attr(node, "module_name", "MODULE_NAME") ?? "",


                    max:
                    Number(
                        this.attr(node, "max", "MAX")
                    ) || 0

                }
                : null;


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
                    ),


                    // Only one plays, based on whether the learner's
                    // chosen option was the higher-scored (correct) one.
                    feedback:
                    this.collectConditionalFeedback(
                        node,
                        ["BRANCH_POINT"]
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


                revealTabs,


                dragDrop,


                scoreCheckpoint,


                scoreBranch:
                this.collectScoreBranch(node),


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


                    // Both paths converge to the SAME score-branch
                    // closing dialogue, evaluated once the path itself
                    // finishes — carry it forward to whichever path the
                    // learner actually takes.
                    scoreBranch:
                    this.collectScoreBranch(node),


                    children:
                    pathNode.children ?? []

                });

            }

        }


        return screens;

    }

}
