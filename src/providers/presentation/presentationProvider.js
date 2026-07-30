import CourseBuilder from "./builders/courseBuilder.js";
import TimelineBuilder from "../../runtime/builders/timelineBuilder.js";


export default class PresentationProvider {


    constructor() {

        this.courseBuilder =
            new CourseBuilder();


        this.timelineBuilder =
            new TimelineBuilder();

    }



    async build(ccir) {


        const presentation =
            await this.courseBuilder.build(ccir);



        const theme =
            ccir.theme ??
            "modern";


        presentation.theme =
            theme;



        for (const page of presentation.pages ?? []) {


            page.timeline =
                this.timelineBuilder.build(page);



            const screen =
                ccir.screens?.find(
                    item =>
                    item.id === page.id
                );



            if (screen?.assetRef) {

                for (const layer of page.layers ?? []) {

                    const imageComponent =
                        layer.components?.find(
                            component =>
                            component.type === "IMAGE"
                        );


                    if (imageComponent) {

                        imageComponent.asset =
                            screen.assetRef.src ??
                            screen.assetRef.name ??
                            null;


                        imageComponent.properties.asset =
                            imageComponent.asset;

                    }

                }

            }



            this.attachVoiceAssets(
                page,
                ccir
            );



            for (const layer of page.layers ?? []) {


                if (!layer.template) {

                    layer.template =
                        this.resolveTemplate(layer);

                }


                if (!layer.theme) {

                    layer.theme =
                        theme;

                }

            }

        }



        if (ccir.assets) {

            presentation.assets =
                ccir.assets;

        }


        if (ccir.assets?.branding) {

            presentation.branding =
                ccir.assets.branding;

        }


        if (ccir.assets?.audio) {

            presentation.audio =
                ccir.assets.audio;

        }



        return presentation;

    }



    attachVoiceAssets(
        page,
        ccir
    ) {


        const audioAssets = [

            ...(ccir.assets?.audio?.dialogue ?? []),

            ...(ccir.assets?.audio?.narration ?? []),

            ...(ccir.assets?.audio?.background ?? [])

        ];



        for (const layer of page.layers ?? []) {


            for (const component of layer.components ?? []) {


                if (
                    component.type !== "DIALOGUE"
                ) {

                    continue;

                }



                const voiceId =
                    component.properties?.voiceId;



                if (!voiceId) {

                    continue;

                }



                const screenId =
                    page.id
                    ?.toLowerCase()
                    ?? "";



                const audio =
                    audioAssets.find(
                        item => {

                            const filename =
                                item.name
                                ?.toLowerCase()
                                ?? "";


                            return (
                                filename.includes(
                                    voiceId
                                    .toLowerCase()
                                    .replace("_","-")
                                )
                                ||
                                filename.startsWith(
                                    "vo-" +
                                    screenId
                                )
                            );

                        }
                    );



                if (!audio) {

                    continue;

                }



                component.voice =
                    audio;


                component.asset =
                    audio;

            }

        }

    }



    resolveTemplate(layer) {


        const type =
            layer.type ?? "";


        if (type === "DIALOGUE") {

            return "dialogue";

        }


        if (type === "IMAGE") {

            return "image";

        }


        if (type === "ASSESSMENT") {

            return "assessment";

        }


        return "content";

    }

}