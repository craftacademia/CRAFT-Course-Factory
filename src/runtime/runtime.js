export default class Runtime {

    constructor(config = {}) {

        this.config = config;

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


        document.body.appendChild(
            this.backgroundPlayer
        );

    }



    playBackground() {

        if (
            this.backgroundPlayer
        ) {

            this.backgroundPlayer.play();

        }

    }



    stopBackground() {

        if (
            this.backgroundPlayer
        ) {

            this.backgroundPlayer.pause();

        }

    }



    playAudio(asset) {

        if (!asset) {

            return;

        }


        const player =
            document.createElement(
                "audio"
            );


        player.src =
            asset.path;


        player.play();

    }

}