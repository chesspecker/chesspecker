import {fetcher} from './fetcher';
import {achievements} from '@/data/achievements';
import {Data} from '@/pages/api/user';
import type {AchievementItem, AchievementInterface} from '@/models/types';

export const checkForAchievement = async (
	strikeMistakes: number,
	strikeTime: number,
	lastTime: number,
): Promise<AchievementInterface[]> => {
	const response = (await fetcher.get('/api/user')) as Data;
	if (!response.success) return;
	const list: AchievementItem[] = response.user.validatedAchievements;
	const promises = [];
	const result = [];

	for (const achievement of achievements) {
		if (list.map(item => item.id).includes(achievement.id)) continue;
		if (!achievement.isValidated({strikeMistakes, strikeTime, lastTime}))
			continue;
		promises.push(
			fetcher.post(`/api/achievement`, {achievementId: achievement.id}),
		);
		result.push(achievement);
	}

	await Promise.all(promises);
	return result;
};
