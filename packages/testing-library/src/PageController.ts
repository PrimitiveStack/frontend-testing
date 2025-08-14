import type { Render } from "@primitivestack/frontend-testing-core";

export class PageController<TNode> {
	constructor(
		private readonly node: TNode,
		private readonly render: Render<TNode>,
	) {}

	open() {
		this.render(this.node);
	}
}
