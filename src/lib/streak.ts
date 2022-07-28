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

import type {UpdateQuery} from 'mongoose';
import {User} from '@/models/user';
import {Streak} from '@/models/streak';

export const resetStreakCount = (date: string) => ({
	startDate: date,
	lastLoginDate: date,
	currentCount: 1,
});

export const incrementStreakCount = (
	currentStreak: Streak,
	date: string,
): Streak => ({
	startDate: currentStreak.startDate,
	lastLoginDate: date,
	currentCount:
		Number.parseInt(currentStreak.lastLoginDate.split('/')[1]!, 10) -
		Number.parseInt(currentStreak.startDate.split('/')[1]!, 10) +
		1,
});

export const updateStreak = async (
	id: string,
	data: UpdateQuery<Partial<User>>,
) =>
	fetch(`/api/user/${id}`, {method: 'PUT', body: JSON.stringify(data)}).then(
		async response => response.json(),
	);

/**
 *
 * @param currentDate
 * @param lastLoginDate
 * returns a boolean value indicating whether or not you should increment or
 * reset streak count
 */
export const shouldIncrementOrResetStreakCount = (
	currentDate: string,
	lastLoginDate: string,
) => {
	// We get 11/5/2021
	// so to get 5, we split on / and get the second item
	const difference =
		Number.parseInt(currentDate.split('/')[1]!, 10) -
		Number.parseInt(lastLoginDate.split('/')[1]!, 10);

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
