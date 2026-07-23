export default class TagAttributeParser {

  parse(tagText) {

    const result = {
      tag: "",
      attributes: {}
    };

    const match = tagText.match(/^\[\/?([A-Za-z0-9_-]+)/);

    if (!match) {
      return result;
    }

    result.tag = match[1];

    const regex = /([A-Za-z_][A-Za-z0-9_-]*)=("([^"]*)"|[^\s\]]+)/g;

    let attribute;

    while ((attribute = regex.exec(tagText)) !== null) {

      result.attributes[attribute[1]] =
        attribute[3] !== undefined
          ? attribute[3]
          : attribute[2];

    }

    return result;

  }

}
