export default class IntegrityValidator {

  validate(ccir) {

    const errors = [];

    for (const screen of ccir.screens) {

      if (screen.character && !screen.characterRef) {
        errors.push(
          `Screen '${screen.id}' references unknown character '${screen.character}'.`
        );
      }

      if (screen.location && !screen.locationRef) {
        errors.push(
          `Screen '${screen.id}' references unknown location '${screen.location}'.`
        );
      }

      if (screen.asset && !screen.assetRef) {
        errors.push(
          `Screen '${screen.id}' references unknown asset '${screen.asset}'.`
        );
      }

      if (!Array.isArray(screen.interactions)) {
        errors.push(
          `Screen '${screen.id}' has invalid interaction resolution.`
        );
      }

      for (const interaction of (screen.interactions ?? [])) {

        if (!interaction.id) {
          errors.push(
            `Screen '${screen.id}' contains an interaction without an id.`
          );
        }

        if (!interaction.type) {
          errors.push(
            `Interaction '${interaction.id ?? "<unknown>"}' has no type.`
          );
        }

      }

    }

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }

    return ccir;

  }

}