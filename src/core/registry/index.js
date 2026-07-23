const categories = new Map();

class ProviderRegistry {
  register(category, name, provider) {
    if (!categories.has(category)) {
      categories.set(category, new Map());
    }

    categories.get(category).set(name, provider);
  }

  get(category, name) {
    return categories.get(category)?.get(name);
  }

  getAll(category) {
    return [...(categories.get(category)?.values() || [])];
  }

  list(category) {
    return [...(categories.get(category)?.keys() || [])];
  }

  categories() {
    return [...categories.keys()];
  }

  clear() {
    categories.clear();
  }
}

export default new ProviderRegistry();
