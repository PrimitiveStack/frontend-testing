import type { PageController as IPageController } from "@primitivestack/frontend-testing-core";
import type { Driver } from "./Driver";

export abstract class PageController implements IPageController {
	protected abstract readonly url: string;

	constructor(private readonly driver: Driver) {}

	async open() {
		await this.driver.page.goto(this.url);
	}
}
