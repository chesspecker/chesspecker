const getTimeTaken = (initialTime: number, mistakes = 0) => {
	const timeTaken_ = (Date.now() - initialTime) / 1000;
	const timeTaken = Number.parseFloat(timeTaken_.toFixed(2));
	const timeWithMistakes = timeTaken + 3 * mistakes;
	return {timeTaken, timeWithMistakes};
};

const getTimeInterval = (historyLength: number) => {
	const moveNumber_ = historyLength / 2;
	const maxTime = moveNumber_ * 8;
	const minTime = moveNumber_ * 4;
	return {maxTime, minTime};
};

export const getTime = {
	taken: getTimeTaken,
	interval: getTimeInterval,
};
