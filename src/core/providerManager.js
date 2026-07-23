import registry from "./registry/index.js";

class ProviderManager {
  get(category, name) {
    return registry.get(category, name);
  }

  getAll(category) {
    return registry.getAll(category);
  }

  list(category) {
    return registry.list(category);
  }

  categories() {
    return registry.categories();
  }
}

export default new ProviderManager();
