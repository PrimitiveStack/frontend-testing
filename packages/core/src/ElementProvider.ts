export interface ElementProvider<T> {
	get(): T;
	getMany(): T[];
}
