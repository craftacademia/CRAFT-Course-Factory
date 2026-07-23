export default class ComponentRenderer {

  render(component) {

    if (!component) return "";

    const text =
      component.text ??
      component.value ??
      component.content ??
      component.title ??
      "";

    return `<div class="component">${text}</div>`;

  }

}
