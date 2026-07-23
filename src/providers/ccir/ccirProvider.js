import Provider from "../../core/provider.js";
import CCIRDocument from "./model/ccirDocument.js";
import CourseBuilder from "./builders/courseBuilder.js";
import CharacterBuilder from "./builders/characterBuilder.js";

export default class CCIRProvider extends Provider {

  constructor() {

    super("ccir");

    this.courseBuilder = new CourseBuilder();
    this.characterBuilder = new CharacterBuilder();

  }

  async build(ast) {

    const ccir = new CCIRDocument();

    ccir.course = this.courseBuilder.build(ast);
    ccir.characters = this.characterBuilder.build(ast);

    return ccir;

  }

}
