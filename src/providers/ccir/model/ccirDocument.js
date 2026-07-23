export default class CCIRDocument {

  constructor() {

    this.version = "1.0";

    this.generatedAt = new Date().toISOString();

    this.course = null;

    this.characters = [];

    this.locations = [];

    this.assets = [];

    this.variables = [];

    this.screens = [];

    this.interactions = [];

    this.assessments = [];

    this.metadata = {};

  }

}
