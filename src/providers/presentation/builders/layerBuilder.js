import Layer from "../model/layer.js";

export default class LayerBuilder {

    build(type, components = []) {

        const layer = new Layer();

        layer.type = type;

        for (const component of components) {
            layer.addComponent(component);
        }

        return layer;

    }

}