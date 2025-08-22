import type {
	ComponentConfig,
	PageController as IPageController,
} from "@primitivestack/frontend-testing-core";
import { type Screen, toElements } from "./toElements";

export abstract class PageController<
	TConfig extends ComponentConfig,
	TElement extends Element = Element,
> implements IPageController
{
	protected readonly elements;

	protected constructor(config: TConfig, screen: Screen<TElement>) {
		this.elements = toElements(config, screen);
	}

	abstract open(): Promise<void>;
}
