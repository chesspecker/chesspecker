import type {LichessUser, Perfs} from '@/types/lichess';

export const getRatingFromUser = (user: LichessUser): number => {
	let perfs = 0;
	let gamesPlayed = 0;
	for (const [, value] of Object.entries(user.perfs)) {
		if (!(value as any)?.games) continue;
		const {games, rating} = value as Perfs;
		gamesPlayed += games;
		perfs += games * rating;
	}

	return Math.round(perfs / gamesPlayed);
};
