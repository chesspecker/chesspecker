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
import {useState} from 'react';
import useEffectAsync from './use-effect-async';
import {fetcher} from '@/lib/fetcher';
import type {Streak, UserInterface} from '@/models/types';
import {formattedDate} from '@/lib/utils';

const resetStreakCount = (date: string) => ({
	startDate: date,
	lastLoginDate: date,
	currentCount: 1,
});

/* eslint-disable-next-line no-return-assign */
const incrementStreakCount = (currentStreak: Streak, date: string): Streak => ({
	...currentStreak,
	lastLoginDate: date,
	currentCount: (currentStreak.currentCount += 1),
});

const updateStreak = async (
	id: string,
	body: UpdateQuery<Partial<UserInterface>>,
) => fetcher.put(`/api/user/${id}`, body);

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
		Number.parseInt(currentDate.split('/')[1], 10) -
		Number.parseInt(lastLoginDate.split('/')[1], 10);

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

/**
 *
 * @param {string} id - the user id to update
 * @param {Streak} currentStreak - an object with `currentCount`, `lastLoginDate`, `startDate`
 * @returns Streak - an object with `currentCount`, `lastLoginDate`, `startDate`
 *
 * @example
import { useStreak } from "use-streak";
const streak = useStreak(user.id, user.currentStreak);
// streak returns an object:
// {
//    currentCount: 1,
//    lastLoginDate: "11/11/2021",
//    startDate: "11/11/2021",
// }
 */
const useStreak = (id: string, currentStreak: Streak) => {
	const today = new Date();
	const currentDate = formattedDate(today);
	const [streak, setStreak] = useState<Streak>(currentStreak);

	useEffectAsync(async () => {
		// Check if we should increment or reset
		const {shouldIncrement, shouldReset} = shouldInrementOrResetStreakCount(
			currentDate,
			currentStreak.lastLoginDate,
		);

		if (shouldReset) {
			const updatedStreak = resetStreakCount(currentDate);
			const body: UpdateQuery<Partial<UserInterface>> = {
				$set: {
					streak: updatedStreak,
				},
			};
			await updateStreak(id, body);
			setStreak(() => updatedStreak);
		}

		if (shouldIncrement) {
			const updatedStreak = incrementStreakCount(currentStreak, currentDate);
			const body: UpdateQuery<Partial<UserInterface>> = {
				$set: {
					streak: updatedStreak,
				},
			};
			await updateStreak(id, body);
			setStreak(() => updatedStreak);
		}
	}, []);

	return streak;
};

export default useStreak;
