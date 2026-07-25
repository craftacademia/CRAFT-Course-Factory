import { walk } from "../utils/treeWalker.js";

export default class ScreenBuilder {

  build(ast) {

    const screens = [];
    let screenNumber = 1;

    walk(ast, node => {

      if (node.type !== "SCREEN") {
        return;
      }

      const id =
        node.attributes?.id ??
        `SCREEN_${String(screenNumber).padStart(3, "0")}`;

      const screen = {
        id,
        title: node.attributes?.title ?? `Screen ${screenNumber}`,
        type: node.attributes?.type ?? "content",
        character: node.attributes?.character ?? null,
        location: node.attributes?.location ?? null,
        asset: node.attributes?.asset ?? null,
        props: [],
        attributes: {
          ...(node.attributes ?? {}),
          id
        },
        children: []
      };

      for (const child of (node.children ?? [])) {

        if (child.type !== "TEXT") {
          screen.children.push(child);
          continue;
        }

        const text = child.value.trim();

        let match;

        match = text.match(/^Location\s*:\s*(.+)$/i);
        if (match) {
          screen.location = match[1].trim();
          continue;
        }

        match = text.match(/^Background\s*:\s*(.+)$/i);
        if (match) {
          screen.asset = match[1].trim();
          continue;
        }

        match = text.match(/^Character\s*:\s*(.+)$/i);
        if (match) {
          screen.character = match[1].trim();
          continue;
        }

        match = text.match(/^Prop\s*:\s*(.+)$/i);
        if (match) {
          screen.props.push(match[1].trim());
          continue;
        }

        screen.children.push(child);

      }

      screens.push(screen);

      screenNumber++;

    });

    return screens;

  }

}