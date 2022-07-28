import {formattedDate} from './utils';
import {
	incrementStreakCount,
	resetStreakCount,
	shouldIncrementOrResetStreakCount,
	updateStreak,
} from './streak';
import {AchievementItem} from '@/models/achievement';
import {Streak} from '@/models/streak';
import {UserData} from '@/pages/api/user';
import {User} from '@/models/user';
import {Puzzle} from '@/models/puzzle';
import {ThemeItem} from '@/models/theme';
import type {AchievementInterface, AchivementsArgs} from '@/types/models';
import {achievements} from '@/data/achievements';

export const checkForAchievement = async (
	args: AchivementsArgs,
): Promise<AchievementInterface[] | void> => {
	const response = await fetch('/api/user').then(
		async reponse => reponse.json() as Promise<UserData>,
	);
	if (!response.success) return;
	const list: AchievementItem[] = response.data.validatedAchievements;
	const promises: Array<Promise<any>> = [];
	const result: AchievementInterface[] = [];

	for (const achievement of achievements) {
		if (list.map(item => item.id).includes(achievement.id)) continue;
		if (!achievement.isValidated(args)) continue;
		promises.push(
			fetch(`/api/achievement`, {
				method: 'POST',
				body: JSON.stringify({achievementId: achievement.id}),
			}),
		);
		result.push(achievement);
	}

	await Promise.all(promises);
	return result;
};

type PropsCheckAchivementBody = {
	user: User;
	initialPuzzleTimer: number;
	totalPuzzleSolved: number;
	puzzle: Puzzle;
	puzzleSolvedByCategories: ThemeItem[];
	streakTime: number;
	streakMistakes: number;
	completionMistakes: number;
};

export const getCheckAchivementBody = ({
	user,
	puzzle,
	initialPuzzleTimer,
	streakMistakes,
	streakTime,
	totalPuzzleSolved,
	puzzleSolvedByCategories,
	completionMistakes,
}: PropsCheckAchivementBody) => {
	if (!puzzle) return;
	const date = formattedDate(new Date());

	// Check if we should increment or reset
	const {shouldIncrement, shouldReset} = shouldIncrementOrResetStreakCount(
		date,
		user.streak.lastLoginDate,
	);

	let streak: Streak = user.streak;
	if (shouldReset) streak = resetStreakCount(date);
	if (shouldIncrement) streak = incrementStreakCount(user.streak, date);

	if (shouldReset || shouldIncrement) {
		updateStreak(user._id.toString(), {
			$set: {streak},
		}).catch(console.error);
	}

	const timeTaken = (Date.now() - initialPuzzleTimer) / 1000;
	const completionTime = Number.parseInt(timeTaken.toFixed(2), 10);

	const body: AchivementsArgs = {
		streakMistakes,
		streakTime,
		completionTime,
		completionMistakes,
		totalPuzzleSolved,
		themes: puzzle.Themes.map(t => {
			const a = puzzleSolvedByCategories.find(c => t === c.title);
			const count = a ? a.count + 1 : 1;
			return {title: t, count};
		}),
		streak,
		isSponsor: user.isSponsor,
	};

	return body;
};
