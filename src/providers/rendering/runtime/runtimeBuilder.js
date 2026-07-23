import Navigation from "./navigation.js";
import Variables from "./variables.js";
import Branching from "./branching.js";
import Assessment from "./assessment.js";

export default class RuntimeBuilder {

  constructor() {

    this.navigation = new Navigation();
    this.variables = new Variables();
    this.branching = new Branching();
    this.assessment = new Assessment();

  }

  async build() {

    return `
${this.navigation.build()}

${this.variables.build()}

${this.branching.build()}

${this.assessment.build()}
`;

  }

}
