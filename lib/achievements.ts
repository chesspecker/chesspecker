import {fetcher} from './fetcher';
import {achievements} from '@/data/achievements';
import {Data} from '@/pages/api/user';

export const checkForAchievement = async (
	strikeMistakes: number,
	strikeTime: number,
	lastTime: number,
) => {
	const response = (await fetcher.get('/api/user')) as Data;
	if (!response.success) return;
	const {validatedAchievements} = response.user;
	const promises = [];

	for (const achievement of achievements) {
		if (validatedAchievements.map(item => item.id).includes(achievement.id))
			continue;
		if (!achievement.isValidated({strikeMistakes, strikeTime, lastTime}))
			continue;
		promises.push(
			fetcher.post(`/api/achievement`, {achievementId: achievement.id}),
		);
		console.log(achievement.name);
	}

	await Promise.all(promises);
};
