import CCIRProvider from "../providers/ccir/ccirProvider.js";

export default class CCIRStage {

    constructor() {

        this.provider =
            new CCIRProvider();

    }


    async run(context) {

        if (!context.output) {

            throw new Error(
                "CCIRStage requires AST output."
            );

        }


        const assetManifest =
            context.metadata.assetManifest ?? null;


        const ccir =
            await this.provider.build(
                context.output,
                assetManifest
            );


        return ccir;

    }

}