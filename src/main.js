import BrowserRuntime from "./runtime/browser/browserRuntime.js";

const runtime = new BrowserRuntime(
    document.getElementById("app")
);

runtime.mount({

    layers: [
        {
            components: [
                {
                    id: "N1",
                    type: "NARRATION",
                    properties: {
                        text: "Browser Runtime Works"
                    }
                }
            ]
        }
    ],

    timeline: [
        {
            componentId: "N1",
            start: 0,
            duration: 3
        }
    ]

});