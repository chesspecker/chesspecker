/**
 * This hook is heavily inspired from jsjoeio's use-streak
 * However we modified it to work with our needs
 * (aka store the streak in the db rather than localStorage)
 *
 * @author Joe Previte - jsjoeio
 * @homepage https://github.com/jsjoeio/use-streak
 * @description A streak counter to track your streak in days (similar to Duolingo)
 * @license MIT
 */

const STREAK_KEY = 'streak';

type Streak = {
	startDate: string;
	lastLoginDate: string;
	currentCount: number;
};

// NOTE@jsjoeio
// sometimes this returns 11/11/2021
// other times it returns 11/11/2021, 12:00:00 AM
// which is why we call the .split at the end
const formattedDate = (date: Date): string =>
	date.toLocaleString('en-US').split(',')[0];

const buildStreakCount = (date: Date): Streak => ({
	startDate: formattedDate(date),
	lastLoginDate: formattedDate(date),
	currentCount: 1,
});

const resetStreakCount = (date: Date) => ({
	startDate: formattedDate(date),
	lastLoginDate: formattedDate(date),
	currentCount: 1,
});

const incrementStreakCount = (currentStreak: Streak, date: Date): Streak => ({
	...currentStreak,
	lastLoginDate: formattedDate(date),
	currentCount: (currentStreak.currentCount += 1),
});

/**
 *
 * @param currentDate
 * @param lastLoginDate
 * returns a boolean value indicating whether or not you should increment or
 * reset streak count
 */
const shouldInrementOrResetStreakCount = (
	currentDate: string,
	lastLoginDate: string,
) => {
	// We get 11/5/2021
	// so to get 5, we split on / and get the second item
	const difference =
		Number.parseInt(currentDate.split('/')[1]) -
		Number.parseInt(lastLoginDate.split('/')[1]);

	// Logging in on the same day
	if (difference === 0) {
		return {
			shouldIncrement: false,
			shouldReset: false,
		};
	}

	// This means they logged in the day after the current
	if (difference === 1) {
		return {
			shouldIncrement: true,
			shouldReset: false,
		};
	}

	// Otherwise they logged in after a day, which would
	// break the streak
	return {
		shouldIncrement: false,
		shouldReset: true,
	};
};

const intializeStreak = (_localStorage: Storage, streak: Streak) => {
	const value = JSON.stringify(streak);
	_localStorage.setItem(STREAK_KEY, value);
};

const updateStreak = (_localStorage: Storage, streak: Streak) => {
	const value = JSON.stringify(streak);
	_localStorage.setItem(STREAK_KEY, value);
};

const getStreak = (_localStorage: Storage): Streak => {
	try {
		const streak = JSON.parse(_localStorage.getItem(STREAK_KEY) || '');
		return streak;
	} catch (error) {
		console.error(
			error,
			'something went wrong getting the streak. JSON.parse error? initializing and getting streak.',
		);

		const today = new Date();
		return initializeAndGetStreak(_localStorage, today);
	}
};

const doesStreakExist = (_localStorage: Storage) => {
	return _localStorage.getItem(STREAK_KEY) !== null;
};

const removeStreak = (_localStorage: Storage) => {
	_localStorage.removeItem(STREAK_KEY);
};

const initializeAndGetStreak = (_localStorage: Storage, currentDate: Date) => {
	const initialStreak = buildStreakCount(currentDate);
	intializeStreak(_localStorage, initialStreak);
	const _streak = getStreak(_localStorage);
	return _streak;
};

/**
 *
 * @param {Storage} _localStorage - pass in `localStorage`
 * @param {Date} currentDate - pass in current date i.e. `new Date()`
 * @returns Streak - an object with `currentCount`, `lastLoginDate`, `startDate`
 * 
 * @example
import { useStreak } from "use-streak";
const today = new Date();
const streak = useStreak(localStorage, today);
// streak returns an object:
// {
//    currentCount: 1,
//    lastLoginDate: "11/11/2021",
//    startDate: "11/11/2021",
// }
 */
const useStreak = (_localStorage: Storage, currentDate: Date) => {
	// Check if streak exists
	const _doesStreakExist = doesStreakExist(_localStorage);

	if (_doesStreakExist) {
		const streak = getStreak(_localStorage);

		// Check if we should increment or reset
		const {shouldIncrement, shouldReset} = shouldInrementOrResetStreakCount(
			formattedDate(currentDate),
			streak?.lastLoginDate || '10/21/2021',
		);

		if (shouldReset) {
			const updatedStreak = resetStreakCount(currentDate);
			updateStreak(_localStorage, updatedStreak);
			return updatedStreak;
		}

		if (shouldIncrement) {
			const updatedStreak = incrementStreakCount(streak, currentDate);
			updateStreak(_localStorage, updatedStreak);
			return updatedStreak;
		}

		return streak;
	}

	const _streak = initializeAndGetStreak(_localStorage, currentDate);
	return _streak;
};

export default useStreak;
