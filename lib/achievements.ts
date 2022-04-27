import {achievements} from '@/data/achievements';
import {Data} from '@/pages/api/user';
import type {
	AchievementItem,
	AchievementInterface,
	AchivementsArgs,
} from '@/types/models';

export const checkForAchievement = async (
	args: AchivementsArgs,
): Promise<AchievementInterface[]> => {
	const data = await fetch('/api/user').then(
		async reponse => reponse.json() as Promise<Data>,
	);
	if (!data.success) return;
	const list: AchievementItem[] = data.user.validatedAchievements;
	const promises: Array<Promise<any>> = [];
	const result: AchievementInterface[] = [];

	for (const achievement of achievements) {
		if (list.map(item => item.id).includes(achievement.id)) continue;
		if (!achievement.isValidated(args)) continue;
		promises.push(
			fetch(`/api/achievement`, {
				method: 'POST',
				body: JSON.stringify({achievementId: achievement.id}),
			}).then(async response => response.json()),
		);
		result.push(achievement);
	}

	await Promise.all(promises);
	return result;
};
