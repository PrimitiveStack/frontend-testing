import type { PageConfig } from "@primitivestack/frontend-testing-core";
import { map } from "ramda";
import type { ArrayTail, SimplifyDeep } from "type-fest";
import { type ElementHandler, toHandler } from "./toHandler";

type AwaitedReturn<T extends (...args: any) => unknown> = Awaited<
	ReturnType<T>
>;

type Screen = {
	getByText: <T extends Element>(id: string, ...params: any[]) => T;
	findByText: <T extends Element>(id: string, ...params: any[]) => Promise<T>;
	findAllByText: <T extends Element>(
		id: string,
		...params: any[]
	) => Promise<T[]>;
	queryByText: <T extends Element>(id: string, ...params: any[]) => T | null;
	getByLabelText: <T extends Element>(id: string, ...params: any[]) => T;
	findByLabelText: <T extends Element>(
		id: string,
		...params: any[]
	) => Promise<T>;
	findAllByLabelText: <T extends Element>(
		id: string,
		...params: any[]
	) => Promise<T[]>;
	queryByLabelText: <T extends Element>(
		id: string,
		...params: any[]
	) => T | null;
};

type ConvertPageConfig<
	TConfig extends PageConfig,
	TScreen extends Screen,
> = SimplifyDeep<{
	[K in keyof TConfig]: (TConfig[K] extends { properties: { text: infer P } }
		? P extends { type: "argument" }
			? {
					getByText<T extends ReturnType<TScreen["getByText"]>>(
						...params: Parameters<TScreen["getByText"]>
					): ElementHandler<T>;
					findByText<T extends ReturnType<TScreen["queryByText"]>>(
						...params: Parameters<TScreen["queryByText"]>
					): T extends Element ? ElementHandler<T> : null;
					waitForByText<T extends AwaitedReturn<TScreen["findByText"]>>(
						...params: Parameters<TScreen["findByText"]>
					): Promise<ElementHandler<T>>;
					waitForAllByText<
						T extends AwaitedReturn<TScreen["findAllByText"]>[number],
					>(
						...params: Parameters<TScreen["findAllByText"]>
					): Promise<ElementHandler<T>[]>;
				}
			: {
					getByText<T extends ReturnType<TScreen["getByText"]>>(
						...params: ArrayTail<Parameters<TScreen["getByText"]>>
					): ElementHandler<T>;
					findByText<T extends ReturnType<TScreen["queryByText"]>>(
						...params: ArrayTail<Parameters<TScreen["queryByText"]>>
					): T extends Element ? ElementHandler<T> : null;
					waitForByText<T extends AwaitedReturn<TScreen["findByText"]>>(
						...params: ArrayTail<Parameters<TScreen["findByText"]>>
					): Promise<ElementHandler<T>>;
					waitForAllByText<
						T extends AwaitedReturn<TScreen["findAllByText"]>[number],
					>(
						...params: ArrayTail<Parameters<TScreen["findAllByText"]>>
					): Promise<ElementHandler<T>[]>;
				}
		: {}) &
		(TConfig[K] extends { properties: { labelText: infer P } }
			? P extends { type: "argument" }
				? {
						getByLabelText<T extends ReturnType<TScreen["getByLabelText"]>>(
							...params: Parameters<TScreen["getByLabelText"]>
						): ElementHandler<T>;
						findByLabelText<T extends ReturnType<TScreen["queryByLabelText"]>>(
							...params: Parameters<TScreen["queryByLabelText"]>
						): T extends Element ? ElementHandler<T> : null;
						waitForByLabelText<
							T extends AwaitedReturn<TScreen["findByLabelText"]>,
						>(
							...params: Parameters<TScreen["findByLabelText"]>
						): Promise<ElementHandler<T>>;
						waitForAllByLabelText<
							T extends AwaitedReturn<TScreen["findAllByLabelText"]>[number],
						>(
							...params: Parameters<TScreen["findAllByLabelText"]>
						): Promise<ElementHandler<T>[]>;
					}
				: {
						getByLabelText<T extends ReturnType<TScreen["getByLabelText"]>>(
							...params: ArrayTail<Parameters<TScreen["getByLabelText"]>>
						): ElementHandler<T>;
						findByLabelText<T extends ReturnType<TScreen["queryByLabelText"]>>(
							...params: ArrayTail<Parameters<TScreen["queryByLabelText"]>>
						): T extends Element ? ElementHandler<T> : null;
						waitForByLabelText<
							T extends AwaitedReturn<TScreen["findByLabelText"]>,
						>(
							...params: ArrayTail<Parameters<TScreen["findByLabelText"]>>
						): Promise<ElementHandler<T>>;
						waitForAllByLabelText<
							T extends AwaitedReturn<TScreen["findAllByLabelText"]>[number],
						>(
							...params: ArrayTail<Parameters<TScreen["findAllByLabelText"]>>
						): Promise<ElementHandler<T>[]>;
					}
			: {});
}>;

export const toElements = <
	TConfig extends PageConfig,
	TElement extends Element,
	TScreen extends Screen,
>(
	config: TConfig,
	screen: TScreen,
) =>
	map((value) => {
		const { properties } = value;

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

		return element;
	}, config) as ConvertPageConfig<TConfig, TScreen>;
