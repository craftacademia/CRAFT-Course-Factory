import RuntimePlayer from "../../src/runtime/runtimePlayer.js";

const page = {

    layers: [

        {

            components: [

                {

                    id: "NARRATION_1",

                    type: "NARRATION",

                    properties: {

                        text: "Welcome to the course."

                    }

                },

                {

                    id: "DIALOGUE_1",

                    type: "DIALOGUE",

                    properties: {

                        text: "Let's begin the lesson."

                    }

                }

            ]

        }

    ],

    timeline: [

        {

            id: "EVENT_001",

            componentId: "NARRATION_1",

            componentType: "NARRATION",

            start: 0,

            duration: 3,

            end: 3

        },

        {

            id: "EVENT_002",

            componentId: "DIALOGUE_1",

            componentType: "DIALOGUE",

            start: 3,

            duration: 4,

            end: 7

        }

    ]

};

const player = new RuntimePlayer(page);

console.log(player.play());