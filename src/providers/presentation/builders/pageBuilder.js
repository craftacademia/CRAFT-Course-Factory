resolveImage(
    screen,
    images
) {

    if (screen.assetRef?.src) {

        return screen.assetRef.src;

    }


    const scene =
        screen.attributes?.scene ??
        null;


    const image =
        images.find(
            item => {

                const imageId =
                    item.name?.replace(
                        /\.[^/.]+$/,
                        ""
                    );


                return (
                    imageId === scene
                );

            }
        );


    return image?.path ?? null;

}