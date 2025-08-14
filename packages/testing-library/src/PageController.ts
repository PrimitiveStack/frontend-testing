import type { Component } from "./Component";

export class PageController {
	constructor(private readonly component: Component) {}

	open() {
		this.component.render();
	}
}
