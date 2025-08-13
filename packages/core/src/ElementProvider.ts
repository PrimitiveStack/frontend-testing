export interface ElementProvider<T> {
	get(): Promise<T>;
	getMany(): Promise<T[]>;
}
