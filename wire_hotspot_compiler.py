base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. ccirProvider.js ────────────────────────────────────────────────────────

ccir_path = base + '/src/providers/ccir/ccirProvider.js'

with open(ccir_path) as f:
    ccir = f.read()

if 'HOTSPOT_ITEM' in ccir:
    print('1. Already in ccirProvider — skipping')
else:
    old = """            const cardNodes =
                (node.children ?? [])
                .filter(
                    child =>
                    child.type === "CARD"
                );"""

    new = """            const hotspotItemNodes =
                (node.children ?? [])
                .filter(child => child.type === "HOTSPOT_ITEM");

            const hotspotItems =
                hotspotItemNodes.length > 0
                ? hotspotItemNodes.map(itemNode => {
                    const textNode = (itemNode.children ?? []).find(c => c.type === "TEXT");
                    return {
                        id:       this.attr(itemNode, "id",       "ID"),
                        title:    this.attr(itemNode, "title",    "TITLE")    ?? "",
                        subtitle: this.attr(itemNode, "subtitle", "SUBTITLE") ?? "",
                        assetRef: this.attr(itemNode, "asset_ref","ASSET_REF"),
                        text:     (textNode?.value ?? "").trim()
                    };
                })
                : null;


            const cardNodes =
                (node.children ?? [])
                .filter(
                    child =>
                    child.type === "CARD"
                );"""

    assert ccir.count(old) == 1, 'cardNodes anchor not unique'
    ccir = ccir.replace(old, new)

    old2 = """                tabContent,


                revealTabs,


                dragDrop,"""

    new2 = """                tabContent,


                revealTabs,


                hotspotItems,


                dragDrop,"""

    assert ccir.count(old2) == 1, 'screens.push anchor not unique'
    ccir = ccir.replace(old2, new2)

    with open(ccir_path, 'w') as f:
        f.write(ccir)
    print('1. ccirProvider updated')


# ── 2. pageBuilder.js ─────────────────────────────────────────────────────────

pb_path = base + '/src/providers/presentation/builders/pageBuilder.js'

with open(pb_path) as f:
    pb = f.read()

if 'HOTSPOT_PANEL' in pb:
    print('2. Already in pageBuilder — skipping')
else:
    # Exclude hotspot feedback from dialogue
    old3 = """                        screen.branching?.feedback?.correct,
                        screen.branching?.feedback?.incorrect"""

    new3 = """                        screen.branching?.feedback?.correct,
                        screen.branching?.feedback?.incorrect,
                        ...((screen.hotspotItems?.length ?? 0) > 0 && screen.branching
                            ? [screen.branching.feedback?.correct, screen.branching.feedback?.incorrect]
                            : [])"""

    assert pb.count(old3) == 1, 'feedbackVoiceIds anchor not unique'
    pb = pb.replace(old3, new3)

    # Suppress BRANCHING component for hotspot screens
    old4 = """            if (
                screen.branching &&
                screen.branching.options?.length > 0
            ) {"""

    new4 = """            const isHotspotScreen = (screen.hotspotItems?.length ?? 0) > 0;

            if (
                screen.branching &&
                screen.branching.options?.length > 0 &&
                !isHotspotScreen
            ) {"""

    assert pb.count(old4) == 1, 'branching suppress anchor not unique'
    pb = pb.replace(old4, new4)

    # Add HOTSPOT_PANEL before dragDrop
    old5 = """            if (
                screen.dragDrop &&
                screen.dragDrop.cards?.length > 0
            ) {"""

    new5 = """            if (screen.hotspotItems && screen.hotspotItems.length > 0) {

                components.push(
                    this.componentBuilder.build("HOTSPOT_PANEL", {
                        id: `HOTSPOT_PANEL_${screen.id}`,
                        properties: {
                            locationImage: screenImage ?? null,
                            items: screen.hotspotItems.map(item => ({
                                id:       item.id,
                                title:    item.title,
                                subtitle: item.subtitle,
                                text:     item.text,
                                image:    this.findImageByRef(images, item.assetRef)
                            })),
                            branching: screen.branching ?? null
                        }
                    })
                );

            }


            if (
                screen.dragDrop &&
                screen.dragDrop.cards?.length > 0
            ) {"""

    assert pb.count(old5) == 1, 'dragDrop anchor not unique'
    pb = pb.replace(old5, new5)

    with open(pb_path, 'w') as f:
        f.write(pb)
    print('2. pageBuilder updated')


print('\nDone — compiler changes complete')
