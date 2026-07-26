export default class PropRenderer {

    render(component, context) {

        const name = component?.properties?.name ?? "";

        context.append(`
            <div class="prop">
                ${name}
            </div>
        `);

    }

}