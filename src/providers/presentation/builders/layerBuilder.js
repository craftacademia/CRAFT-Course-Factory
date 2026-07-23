import Layer from "../model/layer.js";

export default class LayerBuilder {

    build(type, component) {

        const layer = new Layer();

        layer.type = type;
        layer.component = component;

        return layer;

    }

}