export default class Runtime {

    constructor(config = {}) {

        this.config =
            config;

        this.audio =
            config.audio ?? null;

        this.backgroundPlayer =
            null;

    }


    init() {

        if (!this.audio) {

            return;

        }


        this.loadBackgroundMusic();

    }



    loadBackgroundMusic() {

        const background =
            this.audio.background?.[0];


        if (!background) {

            return;

        }


        this.backgroundPlayer =
            document.createElement(
                "audio"
            );


        this.backgroundPlayer.src =
            background.path;


        this.backgroundPlayer.loop =
            true;


        this.backgroundPlayer.preload =
            "auto";


        this.backgroundPlayer.setAttribute(
            "data-runtime-audio",
            "background"
        );


        document.body.appendChild(
            this.backgroundPlayer
        );

    }



    playBackground() {

        if (
            this.backgroundPlayer
        ) {

            return this.backgroundPlayer.play();

        }


        return Promise.resolve();

    }



    stopBackground() {

        if (
            this.backgroundPlayer
        ) {

            this.backgroundPlayer.pause();

            this.backgroundPlayer.currentTime =
                0;

        }

    }



    pauseBackground() {

        if (
            this.backgroundPlayer
        ) {

            this.backgroundPlayer.pause();

        }

    }


}