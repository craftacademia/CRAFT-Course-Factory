import registry from "../../../core/apiRegistry.js";
import Provider from "../../../core/provider.js";

class BranchingProvider extends Provider {
  constructor() {
    super("branching");
  }

  execute(data) {
    return data;
  }
}

registry.register(
  "interactions",
  "branching",
  new BranchingProvider()
);
