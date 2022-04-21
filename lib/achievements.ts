import {fetcher} from './fetcher';
import {achievements} from '@/data/achievements';
import {Data} from '@/pages/api/user';
import type {
	AchievementItem,
	AchievementInterface,
	AchivementsArgs,
} from '@/models/types';

export const checkForAchievement = async (
	args: AchivementsArgs,
): Promise<AchievementInterface[]> => {
	console.log('in the function', args);
	const response = (await fetcher.get('/api/user')) as Data;
	if (!response.success) return;
	const list: AchievementItem[] = response.user.validatedAchievements;
	const promises = [];
	const result = [];

	for (const achievement of achievements) {
		console.log(achievement.isValidated(args));
		if (list.map(item => item.id).includes(achievement.id)) continue;
		if (!achievement.isValidated(args)) continue;
		promises.push(
			fetcher.post(`/api/achievement`, {achievementId: achievement.id}),
		);
		result.push(achievement);
	}

	await Promise.all(promises);
	return result;
};
