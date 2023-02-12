const ONE_DAY = 86_400;
const ONE_HOUR = 3600;
const ONE_MINUTE = 60;

export const getDays = (count: number): [number, number] =>
	count < ONE_DAY
		? [0, count % ONE_DAY]
		: [Math.floor(count / ONE_DAY), count % ONE_DAY];

const getHours = (count: number): [number, number] =>
	count < ONE_HOUR
		? [0, count % ONE_HOUR]
		: [Math.floor(count / ONE_HOUR), count % ONE_HOUR];

const getMinutes = (count: number): [number, number] =>
	count < ONE_MINUTE
		? [0, count % ONE_MINUTE]
		: [Math.floor(count / ONE_MINUTE), count % ONE_MINUTE];

export const useClock = (
	count: number,
): {clock: [number, number, number, number]} => {
	if (count <= 0) return {clock: [0, 0, 0, 0]};
	const [days, hoursLeft] = getDays(count);
	const [hours, minutesLeft] = getHours(hoursLeft);
	const [minutes, seconds] = getMinutes(minutesLeft);
	return {clock: [days, hours, minutes, Math.round(seconds)]};
};
