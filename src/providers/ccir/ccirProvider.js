import Provider from "../../core/provider.js";
import CCIRDocument from "./model/ccirDocument.js";
import CourseBuilder from "./builders/courseBuilder.js";

export default class CCIRProvider extends Provider {

  constructor() {

    super("ccir");

    this.courseBuilder = new CourseBuilder();

  }

  async build(ast) {

    const ccir = new CCIRDocument();

    ccir.course = this.courseBuilder.build(ast);

    return ccir;

  }

}
