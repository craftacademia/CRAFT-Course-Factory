export default class ReferenceResolver {

  resolve(ccir) {

    const lookup = {

      characters: new Map(),
      locations: new Map(),
      assets: new Map(),
      variables: new Map(),
      screens: new Map(),
      interactions: new Map(),
      assessments: new Map()

    };

    for (const item of ccir.characters) {
      if (item.id) lookup.characters.set(item.id, item);
    }

    for (const item of ccir.locations) {
      if (item.id) lookup.locations.set(item.id, item);
    }

    for (const item of ccir.assets) {
      if (item.id) lookup.assets.set(item.id, item);
    }

    for (const item of ccir.variables) {
      if (item.id) lookup.variables.set(item.id, item);
    }

    for (const item of ccir.screens) {
      if (item.id) lookup.screens.set(item.id, item);
    }

    for (const item of ccir.interactions) {
      if (item.id) lookup.interactions.set(item.id, item);
    }

    for (const item of ccir.assessments) {
      if (item.id) lookup.assessments.set(item.id, item);
    }

    for (const screen of ccir.screens) {

      screen.characterRef =
        screen.character
          ? lookup.characters.get(screen.character) ?? null
          : null;

      screen.locationRef =
        screen.location
          ? lookup.locations.get(screen.location) ?? null
          : null;

      screen.assetRef =
        screen.asset
          ? lookup.assets.get(screen.asset) ?? null
          : null;

      screen.interactions = ccir.interactions.filter(
        interaction => interaction.target === screen.id
      );

    }

    ccir.lookup = lookup;

    ccir.index = {
      characters: Object.fromEntries(lookup.characters),
      locations: Object.fromEntries(lookup.locations),
      assets: Object.fromEntries(lookup.assets),
      variables: Object.fromEntries(lookup.variables),
      screens: Object.fromEntries(lookup.screens),
      interactions: Object.fromEntries(lookup.interactions),
      assessments: Object.fromEntries(lookup.assessments)
    };

    return ccir;

  }

}