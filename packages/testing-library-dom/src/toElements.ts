import type { ComponentConfig } from "@primitivestack/frontend-testing-core";
import type {
	SelectorMatcherOptions,
	waitForOptions,
} from "@testing-library/dom";
import { map } from "ramda";
import type { ArrayTail, SimplifyDeep } from "type-fest";
import { type ElementHandler, toHandler } from "./toHandler";

type AwaitedReturn<T extends (...args: any) => unknown> = Awaited<
	ReturnType<T>
>;

export type Screen<TElement extends Element = Element> = {
	getByText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
	) => T;
	findByText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
		waitForElementOptions?: waitForOptions,
	) => Promise<T>;
	findAllByText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
		waitForElementOptions?: waitForOptions,
	) => Promise<T[]>;
	queryByText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
	) => T | null;

	getByLabelText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
	) => T;
	findByLabelText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
		waitForElementOptions?: waitForOptions,
	) => Promise<T>;
	findAllByLabelText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
		waitForElementOptions?: waitForOptions,
	) => Promise<T[]>;
	queryByLabelText: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
	) => T | null;

	getByTitle: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
	) => T;
	findByTitle: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
		waitForElementOptions?: waitForOptions,
	) => Promise<T>;
	findAllByTitle: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
		waitForElementOptions?: waitForOptions,
	) => Promise<T[]>;
	queryByTitle: <T extends TElement>(
		id: string,
		options?: SelectorMatcherOptions,
	) => T | null;
};

export type ConvertPageConfig<
	TConfig extends ComponentConfig,
	TElement extends Element,
> = SimplifyDeep<{
	[K in keyof TConfig]: (TConfig[K] extends { properties: { text: infer P } }
		? P extends { type: "argument" }
			? {
					getByText<T extends ReturnType<Screen<TElement>["getByText"]>>(
						...params: Parameters<Screen<TElement>["getByText"]>
					): ElementHandler<T>;
					findByText<T extends ReturnType<Screen<TElement>["queryByText"]>>(
						...params: Parameters<Screen<TElement>["queryByText"]>
					): T extends Element ? ElementHandler<T> : null;
					waitForByText<
						T extends AwaitedReturn<Screen<TElement>["findByText"]>,
					>(
						...params: Parameters<Screen<TElement>["findByText"]>
					): Promise<ElementHandler<T>>;
					waitForAllByText<
						T extends AwaitedReturn<Screen<TElement>["findAllByText"]>[number],
					>(
						...params: Parameters<Screen<TElement>["findAllByText"]>
					): Promise<ElementHandler<T>[]>;
				}
			: {
					getByText<T extends ReturnType<Screen<TElement>["getByText"]>>(
						...params: ArrayTail<Parameters<Screen<TElement>["getByText"]>>
					): ElementHandler<T>;
					findByText<T extends ReturnType<Screen<TElement>["queryByText"]>>(
						...params: ArrayTail<Parameters<Screen<TElement>["queryByText"]>>
					): T extends Element ? ElementHandler<T> : null;
					waitForByText<
						T extends AwaitedReturn<Screen<TElement>["findByText"]>,
					>(
						...params: ArrayTail<Parameters<Screen<TElement>["findByText"]>>
					): Promise<ElementHandler<T>>;
					waitForAllByText<
						T extends AwaitedReturn<Screen<TElement>["findAllByText"]>[number],
					>(
						...params: ArrayTail<Parameters<Screen<TElement>["findAllByText"]>>
					): Promise<ElementHandler<T>[]>;
				}
		: {}) &
		(TConfig[K] extends { properties: { labelText: infer P } }
			? P extends { type: "argument" }
				? {
						getByLabelText<
							T extends ReturnType<Screen<TElement>["getByLabelText"]>,
						>(
							...params: Parameters<Screen<TElement>["getByLabelText"]>
						): ElementHandler<T>;
						findByLabelText<
							T extends ReturnType<Screen<TElement>["queryByLabelText"]>,
						>(
							...params: Parameters<Screen<TElement>["queryByLabelText"]>
						): T extends Element ? ElementHandler<T> : null;
						waitForByLabelText<
							T extends AwaitedReturn<Screen<TElement>["findByLabelText"]>,
						>(
							...params: Parameters<Screen<TElement>["findByLabelText"]>
						): Promise<ElementHandler<T>>;
						waitForAllByLabelText<
							T extends AwaitedReturn<
								Screen<TElement>["findAllByLabelText"]
							>[number],
						>(
							...params: Parameters<Screen<TElement>["findAllByLabelText"]>
						): Promise<ElementHandler<T>[]>;
					}
				: {
						getByLabelText<
							T extends ReturnType<Screen<TElement>["getByLabelText"]>,
						>(
							...params: ArrayTail<
								Parameters<Screen<TElement>["getByLabelText"]>
							>
						): ElementHandler<T>;
						findByLabelText<
							T extends ReturnType<Screen<TElement>["queryByLabelText"]>,
						>(
							...params: ArrayTail<
								Parameters<Screen<TElement>["queryByLabelText"]>
							>
						): T extends Element ? ElementHandler<T> : null;
						waitForByLabelText<
							T extends AwaitedReturn<Screen<TElement>["findByLabelText"]>,
						>(
							...params: ArrayTail<
								Parameters<Screen<TElement>["findByLabelText"]>
							>
						): Promise<ElementHandler<T>>;
						waitForAllByLabelText<
							T extends AwaitedReturn<
								Screen<TElement>["findAllByLabelText"]
							>[number],
						>(
							...params: ArrayTail<
								Parameters<Screen<TElement>["findAllByLabelText"]>
							>
						): Promise<ElementHandler<T>[]>;
					}
			: {}) &
		(TConfig[K] extends { attributes: { title: string } }
			? {
					getByTitle<T extends ReturnType<Screen<TElement>["getByTitle"]>>(
						...params: ArrayTail<Parameters<Screen<TElement>["getByTitle"]>>
					): ElementHandler<T>;
					findByTitle<T extends ReturnType<Screen<TElement>["queryByTitle"]>>(
						...params: ArrayTail<Parameters<Screen<TElement>["queryByTitle"]>>
					): T extends Element ? ElementHandler<T> : null;
					waitForByTitle<
						T extends AwaitedReturn<Screen<TElement>["findByTitle"]>,
					>(
						...params: ArrayTail<Parameters<Screen<TElement>["findByTitle"]>>
					): Promise<ElementHandler<T>>;
					waitForAllByTitle<
						T extends AwaitedReturn<Screen<TElement>["findAllByTitle"]>[number],
					>(
						...params: ArrayTail<Parameters<Screen<TElement>["findAllByTitle"]>>
					): Promise<ElementHandler<T>[]>;
				}
			: {});
}>;

export const toElements = <
	TConfig extends ComponentConfig,
	TElement extends Element,
>(
	config: TConfig,
	screen: Screen<TElement>,
) =>
	map((value) => {
		const { properties, attributes } = value;

		let element = {} as Record<PropertyKey, unknown>;

		if (properties) {
			const { labelText, text } = properties;

			if (text) {
				if (text.type === "const") {
					const { value } = text;

					element = {
						...element,
						getByText: (...params: any[]) =>
							toHandler(screen.getByText(value, ...params)),
						findByText(...params: any[]) {
							const element = screen.queryByText(value, ...params);
							return element ? toHandler(element) : element;
						},
						waitForByText: async (...params: any[]) =>
							toHandler(await screen.findByText(value, ...params)),
						waitForAllByText: async (...params: any[]) =>
							(await screen.findAllByText(value, ...params)).map(toHandler),
					};
				}

				element = {
					...element,
					getByText: (value: string, ...params: any[]) =>
						toHandler(screen.getByText(value, ...params)),
					findByText(value: string, ...params: any[]) {
						const element = screen.queryByText(value, ...params);
						return element ? toHandler(element) : element;
					},
					waitForByText: async (value: string, ...params: any[]) =>
						toHandler(await screen.findByText(value, ...params)),
					waitForAllByText: async (value: string, ...params: any[]) =>
						(await screen.findAllByText(value, ...params)).map(toHandler),
				};
			}

			if (labelText) {
				if (labelText.type === "const") {
					const { value } = labelText;

					element = {
						...element,
						getByLabelText: (...params: any[]) =>
							toHandler(screen.getByLabelText(value, ...params)),
						findByLabelText(...params: any[]) {
							const element = screen.queryByLabelText(value, ...params);
							return element ? toHandler(element) : element;
						},
						waitForByLabelText: async (...params: any[]) =>
							toHandler(await screen.findByLabelText(value, ...params)),
						waitForAllByLabelText: async (...params: any[]) =>
							(await screen.findAllByLabelText(value, ...params)).map(
								toHandler,
							),
					};
				}

				element = {
					...element,
					getByLabelText: (value: string, ...params: any[]) =>
						toHandler(screen.getByLabelText(value, ...params)),
					findByLabelText(value: string, ...params: any[]) {
						const element = screen.queryByLabelText(value, ...params);
						return element ? toHandler(element) : element;
					},
					waitForByLabelText: async (value: string, ...params: any[]) =>
						toHandler(await screen.findByLabelText(value, ...params)),
					waitForAllByLabelText: async (value: string, ...params: any[]) =>
						(await screen.findAllByLabelText(value, ...params)).map(toHandler),
				};
			}
		}

		if (attributes) {
			const { title } = attributes;

			if (title) {
				element = {
					...element,
					getByTitle: (...params: any[]) =>
						toHandler(screen.getByTitle(title, ...params)),
					findByTitle(...params: any[]) {
						const element = screen.queryByTitle(title, ...params);
						return element ? toHandler(element) : element;
					},
					waitForByTitle: async (...params: any[]) =>
						toHandler(await screen.findByTitle(title, ...params)),
					waitForAllByTitle: async (...params: any[]) =>
						(await screen.findAllByTitle(title, ...params)).map(toHandler),
				};
			}
		}

		return element;
	}, config) as ConvertPageConfig<TConfig, TElement>;
