export default class ComponentRenderer {

    render(component) {

        throw new Error(

            `${this.constructor.name} must implement render().`

        );

    }

}