import {achievements} from '@/data/achievements';
import {AchievementItem} from '@/models/achievement';
import {UserData} from '@/pages/api/user';
import type {AchievementInterface, AchivementsArgs} from '@/types/models';

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
