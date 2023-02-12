export const sortBy = <T extends {[key: string]: any}>(
	array: T[],
	param: string,
): T[] =>
	[...array].sort((objectA, objectB) =>
		objectA[param] > objectB[param]
			? 1
			: objectA[param] < objectB[param]
			? -1
			: 0,
	);
