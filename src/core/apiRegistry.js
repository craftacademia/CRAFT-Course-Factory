class APIRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(category, name, provider) {
    if (!this.providers.has(category)) {
      this.providers.set(category, new Map());
    }

    this.providers.get(category).set(name, provider);
  }

  get(category, name) {
    return this.providers.get(category)?.get(name);
  }

  getAll(category) {
    return [...(this.providers.get(category)?.values() || [])];
  }

  categories() {
    return [...this.providers.keys()];
  }

  clear() {
    this.providers.clear();
  }
}

export default new APIRegistry();
