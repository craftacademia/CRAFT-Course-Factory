import Provider from "../../core/provider.js";
import CCIRDocument from "./model/ccirDocument.js";
import CourseBuilder from "./builders/courseBuilder.js";
import CharacterBuilder from "./builders/characterBuilder.js";
import LocationBuilder from "./builders/locationBuilder.js";
import AssetBuilder from "./builders/assetBuilder.js";
import VariableBuilder from "./builders/variableBuilder.js";

export default class CCIRProvider extends Provider {

  constructor() {

    super("ccir");

    this.courseBuilder = new CourseBuilder();
    this.characterBuilder = new CharacterBuilder();
    this.locationBuilder = new LocationBuilder();
    this.assetBuilder = new AssetBuilder();
    this.variableBuilder = new VariableBuilder();

  }

  async build(ast) {

    const ccir = new CCIRDocument();

    ccir.course = this.courseBuilder.build(ast);
    ccir.characters = this.characterBuilder.build(ast);
    ccir.locations = this.locationBuilder.build(ast);
    ccir.assets = this.assetBuilder.build(ast);
    ccir.variables = this.variableBuilder.build(ast);

    return ccir;

  }

}
