const parseGrade: {[key: number]: string} = {
	0: 'F',
	1: 'E',
	2: 'D',
	3: 'C',
	4: 'B',
	5: 'A',
	6: 'A+',
};

Object.freeze(parseGrade);
export {parseGrade};

type GetGradeParams = {
	didCheat: boolean;
	mistakes: number;
	timeTaken: number;
	maxTime: number;
	minTime: number;
	streak: number;
};

export const getGrade = ({
	didCheat,
	mistakes,
	timeTaken,
	maxTime,
	minTime,
	streak = 0,
}: GetGradeParams) => {
	if (didCheat || mistakes >= 3) return 1;
	if (mistakes === 2 || (mistakes === 1 && timeTaken >= maxTime)) return 2;
	if (mistakes === 1 || timeTaken >= maxTime) return 3;
	if (timeTaken >= minTime) return 4;
	if (streak < 2) return 5;
	return 6;
};
