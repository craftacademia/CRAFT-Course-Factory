export default class DragDropRenderer {

    render(component, context) {

        const cards =
            component.properties?.cards ?? [];


        const zones =
            component.properties?.zones ?? [];


        const cardHtml =
            cards
            .map(
                card => `

<div
class="dragdrop-card"
data-card-id="${card.id}"
data-correct-zone="${card.correctZone ?? ""}">
    <img src="./${card.image?.src ?? ""}" alt="${card.label ?? ""}" draggable="false">
</div>

`
            )
            .join("");


        const zoneHtml =
            zones
            .map(
                zone => `

<div class="dragdrop-zone dragdrop-zone--${zone.color ?? "green"}">
    <div class="dragdrop-zone-label">${zone.label ?? ""}</div>
    <div class="dragdrop-zone-dropspace" data-zone-drop="${zone.id}"></div>
</div>

`
            )
            .join("");


        const html = `
<div class="dragdrop-panel" data-component-id="${component.id}">

    <div class="dragdrop-tray" data-dragdrop-tray="${component.id}">
        ${cardHtml}
    </div>

    <div class="dragdrop-zones">
        ${zoneHtml}
    </div>

    <button
    class="dragdrop-submit-btn"
    data-dragdrop-submit="${component.id}"
    disabled>
        Submit
    </button>

</div>
`;


        if (context && typeof context.append === "function") {

            context.append(html);

        }


        return html;

    }



    bind(
        rootElement,
        component,
        runtime
    ) {

        const panel =
            rootElement.querySelector(
                `[data-component-id="${component.id}"]`
            );


        if (!panel) {
            return;
        }


        const tray =
            panel.querySelector(
                `[data-dragdrop-tray="${component.id}"]`
            );


        const submitButton =
            panel.querySelector(
                `[data-dragdrop-submit="${component.id}"]`
            );


        const cards =
            panel.querySelectorAll(
                ".dragdrop-card"
            );


        const dropspaces =
            panel.querySelectorAll(
                ".dragdrop-zone-dropspace"
            );


        // Tracks where each card currently sits: null (still in tray)
        // or the zone id it's been dropped into.
        const placements = {};


        const allCardsPlaced =
        () => {

            return (
                Object.keys(placements).length ===
                cards.length
            );

        };


        const updateSubmitState =
        () => {

            if (submitButton) {

                submitButton.disabled =
                    !allCardsPlaced();

            }

        };


        const findDropTargetAt =
        (clientX, clientY) => {

            for (const space of dropspaces) {

                const rect =
                    space.getBoundingClientRect();


                if (
                    clientX >= rect.left &&
                    clientX <= rect.right &&
                    clientY >= rect.top &&
                    clientY <= rect.bottom
                ) {

                    return space;

                }

            }


            return null;

        };


        for (const card of cards) {


            let startX = 0;

            let startY = 0;

            let originalParent = null;

            let originalNextSibling = null;


            const onPointerMove =
            (event) => {

                const dx =
                    event.clientX - startX;

                const dy =
                    event.clientY - startY;


                card.style.transform =
                    `translate(${dx}px, ${dy}px)`;

            };


            const onPointerUp =
            (event) => {

                card.releasePointerCapture(
                    event.pointerId
                );


                card.removeEventListener(
                    "pointermove",
                    onPointerMove
                );

                card.removeEventListener(
                    "pointerup",
                    onPointerUp
                );


                card.style.transform = "";

                card.classList.remove(
                    "dragdrop-card--dragging"
                );


                const target =
                    findDropTargetAt(
                        event.clientX,
                        event.clientY
                    );


                if (target) {

                    target.appendChild(card);

                    placements[card.dataset.cardId] =
                        target.dataset.zoneDrop;

                } else if (originalParent) {

                    // Not dropped on a zone — return it to exactly
                    // where it was (tray, or back into a zone it was
                    // already in).
                    originalParent.insertBefore(
                        card,
                        originalNextSibling
                    );

                }


                updateSubmitState();

            };


            card.addEventListener(
                "pointerdown",
                (event) => {

                    if (card.classList.contains("dragdrop-card--locked")) {
                        return;
                    }


                    startX = event.clientX;

                    startY = event.clientY;

                    originalParent = card.parentElement;

                    originalNextSibling = card.nextElementSibling;


                    card.classList.add(
                        "dragdrop-card--dragging"
                    );


                    card.setPointerCapture(
                        event.pointerId
                    );


                    card.addEventListener(
                        "pointermove",
                        onPointerMove
                    );

                    card.addEventListener(
                        "pointerup",
                        onPointerUp
                    );

                }
            );

        }


        if (submitButton) {

            submitButton.addEventListener(
                "click",
                async () => {

                    let allCorrect = true;


                    for (const card of cards) {


                        const cardId =
                            card.dataset.cardId;


                        const correctZone =
                            card.dataset.correctZone;


                        const placedZone =
                            placements[cardId];


                        const isCorrect =
                            placedZone === correctZone;


                        if (!isCorrect) {

                            allCorrect = false;

                        }


                        card.classList.add(
                            isCorrect
                            ? "dragdrop-card--correct"
                            : "dragdrop-card--incorrect"
                        );


                        card.classList.add(
                            "dragdrop-card--locked"
                        );

                    }


                    const score =
                        allCorrect ? 10 : 5;


                    submitButton.disabled = true;


                    // Only one feedback line plays, based on whether
                    // the learner placed every card correctly.
                    const feedback =
                        component.properties?.feedback;

                    const feedbackLine =
                        allCorrect
                        ? feedback?.correct
                        : feedback?.incorrect;


                    if (feedbackLine) {


                        const audioAsset =
                            typeof runtime.findDialogueAudio === "function"
                            ? runtime.findDialogueAudio(feedbackLine.voiceId)
                            : null;


                        if (audioAsset) {

                            await new Promise(
                                resolve => {


                                    const audio =
                                        new Audio(
                                            `./${audioAsset.src}`
                                        );


                                    runtime.currentAudio =
                                        audio;


                                    audio.onended =
                                        resolve;

                                    audio.onerror =
                                        resolve;

                                    audio.onpause =
                                        resolve;


                                    audio.play()
                                    .catch(
                                        resolve
                                    );


                                }
                            );

                        }

                    }


                    runtime.state.variables.set(
                        `dragDrop.${component.id}`,
                        {

                            resolved:true,

                            allCorrect,

                            score

                        }
                    );


                    if (typeof runtime.onStateChange === "function") {

                        runtime.onStateChange();

                    }

                }
            );

        }

    }

}
