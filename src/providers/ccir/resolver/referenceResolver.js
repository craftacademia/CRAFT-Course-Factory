export default class ReferenceResolver {

  resolve(ccir) {

    const index = {

      characters: new Map(),
      locations: new Map(),
      assets: new Map(),
      variables: new Map(),
      screens: new Map(),
      interactions: new Map(),
      assessments: new Map()

    };

    for (const item of ccir.characters) {
      if (item.id) index.characters.set(item.id, item);
    }

    for (const item of ccir.locations) {
      if (item.id) index.locations.set(item.id, item);
    }

    for (const item of ccir.assets) {
      if (item.id) index.assets.set(item.id, item);
    }

    for (const item of ccir.variables) {
      if (item.id) index.variables.set(item.id, item);
    }

    for (const item of ccir.screens) {
      if (item.id) index.screens.set(item.id, item);
    }

    for (const item of ccir.interactions) {
      if (item.id) index.interactions.set(item.id, item);
    }

    for (const item of ccir.assessments) {
      if (item.id) index.assessments.set(item.id, item);
    }

    for (const screen of ccir.screens) {

      if (screen.character) {
        screen.characterRef =
          index.characters.get(screen.character) ?? null;
      }

      if (screen.location) {
        screen.locationRef =
          index.locations.get(screen.location) ?? null;
      }

      if (screen.asset) {
        screen.assetRef =
          index.assets.get(screen.asset) ?? null;
      }

    }

    ccir.index = index;

    return ccir;

  }

}
