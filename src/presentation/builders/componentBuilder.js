export default class ComponentBuilder {


    build(screen) {

        const components = [];



        if (screen.background) {

            components.push({

                id:
                "BACKGROUND_001",

                type:
                "BACKGROUND",

                start:
                0,

                duration:
                screen.duration ?? 0,

                visible:
                true,

                asset:{

                    src:
                    screen.background

                },

                properties:{},

                events:[]

            });

        }



        const lines =
            screen.children?.filter(
                child =>
                child.type === "LINE"
            )
            ??
            [];



        lines.forEach(
            (line, index) => {


                const textNode =
                    line.children?.find(
                        child =>
                        child.type === "TEXT"
                    );



                if (!textNode) {
                    return;
                }



                components.push({

                    id:
                    `DIALOGUE_${index + 1}`,


                    type:
                    "DIALOGUE",


                    start:
                    0,


                    duration:
                    0,


                    visible:
                    true,


                    asset:
                    null,


                    properties:{

                        text:
                        textNode.value ?? "",


                        speaker:
                        line.attributes?.speaker ??
                        line.attributes?.SPEAKER ??
                        null,


                        voiceId:
                        line.attributes?.vo_id ??
                        line.attributes?.voiceId ??
                        line.attributes?.VO_ID ??
                        null,


                        expression:
                        line.attributes?.expression ??
                        line.attributes?.EXPRESSION ??
                        null

                    },


                    events:[]

                });


            }
        );



        return components;

    }

}