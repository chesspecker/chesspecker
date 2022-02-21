export const shuffle = (array: any[]) => {
	let currentIndex = array.length;
	let temporary: any;
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
