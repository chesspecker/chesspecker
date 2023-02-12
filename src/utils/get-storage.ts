export const getStorage = <T>(value: string): T =>
	JSON.parse(localStorage.getItem(value) ?? 'null') as T;
