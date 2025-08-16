import type { NonEmptyObject } from "type-fest";

export type ElementConfig = NonEmptyObject<
	Partial<{
		properties: Partial<Record<"labelText" | "text", string>>;
		attributes: Record<string, string>;
	}>
>;
