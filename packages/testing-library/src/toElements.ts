import type { PageConfig } from "@primitivestack/frontend-testing-core";
import { map } from "ramda";
import type { ArrayTail, SimplifyDeep } from "type-fest";

type Screen = {
	getByText: (id: string, ...params: any[]) => unknown;
	findByText: (id: string, ...params: any[]) => Promise<unknown>;
	findAllByText: (id: string, ...params: any[]) => Promise<unknown[]>;
	queryByText: (id: string, ...params: any[]) => unknown | null;
	getByLabelText: (id: string, ...params: any[]) => unknown;
	findByLabelText: (id: string, ...params: any[]) => Promise<unknown>;
	findAllByLabelText: (id: string, ...params: any[]) => Promise<unknown[]>;
	queryByLabelText: (id: string, ...params: any[]) => unknown | null;
};

type ConvertPageConfig<
	TConfig extends PageConfig,
	TScreen extends Screen,
> = SimplifyDeep<{
	[K in keyof TConfig]: (TConfig[K] extends { properties: { text: infer P } }
		? P extends { type: "argument" }
			? {
					getByText(
						...params: Parameters<TScreen["getByText"]>
					): Promise<ReturnType<TScreen["getByText"]>>;
					findByText(
						...params: ArrayTail<Parameters<TScreen["queryByText"]>>
					): Promise<ReturnType<TScreen["queryByText"]>>;
					waitForByText(
						...params: ArrayTail<Parameters<TScreen["findByText"]>>
					): Promise<ReturnType<TScreen["findByText"]>>;
					waitForAllByText(
						...params: ArrayTail<Parameters<TScreen["findAllByText"]>>
					): Promise<ReturnType<TScreen["findAllByText"]>>;
				}
			: {
					getByText(
						...params: ArrayTail<Parameters<TScreen["getByText"]>>
					): Promise<ReturnType<TScreen["getByText"]>>;
					findByText(
						...params: ArrayTail<Parameters<TScreen["queryByText"]>>
					): Promise<ReturnType<TScreen["queryByText"]>>;
					waitForByText(
						...params: ArrayTail<Parameters<TScreen["findByText"]>>
					): Promise<ReturnType<TScreen["findByText"]>>;
					waitForAllByText(
						...params: ArrayTail<Parameters<TScreen["findAllByText"]>>
					): Promise<ReturnType<TScreen["findAllByText"]>>;
				}
		: {}) &
		(TConfig[K] extends { properties: { labelText: infer P } }
			? P extends { type: "argument" }
				? {
						getByLabelText(
							...params: Parameters<TScreen["getByLabelText"]>
						): Promise<ReturnType<TScreen["getByLabelText"]>>;
						findByLabelText(
							...params: Parameters<TScreen["queryByLabelText"]>
						): Promise<ReturnType<TScreen["queryByLabelText"]>>;
						waitForByLabelText(
							...params: Parameters<TScreen["findByLabelText"]>
						): Promise<ReturnType<TScreen["findByLabelText"]>>;
						waitForAllByLabelText(
							...params: Parameters<TScreen["findAllByLabelText"]>
						): Promise<ReturnType<TScreen["findAllByLabelText"]>>;
					}
				: {
						getByLabelText(
							...params: ArrayTail<Parameters<TScreen["getByLabelText"]>>
						): Promise<ReturnType<TScreen["getByText"]>>;
						findByLabelText(
							...params: ArrayTail<Parameters<TScreen["queryByLabelText"]>>
						): Promise<ReturnType<TScreen["queryByLabelText"]>>;
						waitForByLabelText(
							...params: ArrayTail<Parameters<TScreen["findByLabelText"]>>
						): Promise<ReturnType<TScreen["findByLabelText"]>>;
						waitForAllByLabelText(
							...params: ArrayTail<Parameters<TScreen["findAllByLabelText"]>>
						): Promise<ReturnType<TScreen["findAllByLabelText"]>>;
					}
			: {});
}>;

export const toElements = <TConfig extends PageConfig, TScreen extends Screen>(
	config: TConfig,
	screen: TScreen,
) =>
	map((value) => {
		const { properties } = value;

		let element = {} as Record<PropertyKey, unknown>;

		if (properties) {
			const { labelText, text } = properties;

			if (labelText) {
				if (labelText.type === "const") {
					const { value } = labelText;

					element = {
						...element,
						getByLabelText: (...params: any[]) =>
							screen.getByLabelText(value, ...params),
						findByLabelText: (...params: any[]) =>
							screen.queryByLabelText(value, ...params),
						waitForByLabelText: (...params: any[]) =>
							screen.findByLabelText(value, ...params),
						waitForAllByLabelText: (...params: any[]) =>
							screen.findAllByLabelText(value, ...params),
					};
				}

				element = {
					...element,
					getByLabelText: (value: string, ...params: any[]) =>
						screen.getByLabelText(value, ...params),
					findByLabelText: (value: string, ...params: any[]) =>
						screen.queryByLabelText(value, ...params),
					waitForByLabelText: (value: string, ...params: any[]) =>
						screen.findByLabelText(value, ...params),
					waitForAllByLabelText: (value: string, ...params: any[]) =>
						screen.findAllByLabelText(value, ...params),
				};
			}

			if (text) {
				if (text.type === "const") {
					const { value } = text;

					element = {
						...element,
						getByText: (...params: any[]) => screen.getByText(value, ...params),
						findByText: (...params: any[]) =>
							screen.queryByText(value, ...params),
						waitForByText: (...params: any[]) =>
							screen.findByText(value, ...params),
						waitForAllByText: (...params: any[]) =>
							screen.findAllByText(value, ...params),
					};
				}

				element = {
					...element,
					getByText: (value: string, ...params: any[]) =>
						screen.getByText(value, ...params),
					findByText: (value: string, ...params: any[]) =>
						screen.queryByText(value, ...params),
					waitForByText: (value: string, ...params: any[]) =>
						screen.findByText(value, ...params),
					waitForAllByText: (value: string, ...params: any[]) =>
						screen.findAllByText(value, ...params),
				};
			}
		}

		return element;
	}, config) as ConvertPageConfig<TConfig, TScreen>;
