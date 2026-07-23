export default class ComponentBuilder {

  build(screen) {

    return `
<section class="screen" id="${screen.id}">
  <h1>${screen.title ?? ""}</h1>
</section>`;

  }

}
