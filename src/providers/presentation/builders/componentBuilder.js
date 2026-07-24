import Component from "../model/component.js";

export default class ComponentBuilder {

    build(type, options = {}) {

        const component = new Component();

        component.id = options.id ?? null;

        component.type = type;

        component.layer = options.layer ?? null;

        component.start = options.start ?? 0;

        component.duration = options.duration ?? 0;

        component.visible = options.visible ?? true;

        component.asset = options.asset ?? null;

        component.voice = options.voice ?? null;

        component.animation = options.animation ?? null;

        component.properties = options.properties ?? {};

        component.events = options.events ?? [];

        return component;

    }

}