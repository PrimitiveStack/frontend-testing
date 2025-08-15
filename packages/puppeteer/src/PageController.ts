import type { PageController as IPageController } from "@primitivestack/frontend-testing-core";
import type { Driver } from "./Driver";

export abstract class PageController implements IPageController {
	protected abstract url: string;

	constructor(protected readonly driver: Driver) {}

	async open() {
		await this.driver.page.goto(this.url);
	}
}
