export interface ElementSelector<TElementKey, TElement> {
	get(key: TElementKey): Promise<TElement>;
}
