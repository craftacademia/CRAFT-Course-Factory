export default class LocationRenderer {

    render(component, context) {

        const name = component?.properties?.name ?? "";

        context.append(`
            <div class="location">
                ${name}
            </div>
        `);

    }

}