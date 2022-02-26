export const shuffle = <T>(array: T[]): T[] => {
	let currentIndex = array.length;
	let temporary: T;
	let rnd: number;

	while (currentIndex !== 0) {
		rnd = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporary = array[currentIndex];
		array[currentIndex] = array[rnd];
		array[rnd] = temporary;
	}

	return array;
};

export const sortBy = <T>(array: T[], p: string): T[] =>
	[...array].sort((a, b) => (a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0));
