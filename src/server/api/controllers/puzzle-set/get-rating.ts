import type {PuzzleSet} from '@prisma/client';
import {safeZero} from '@/utils/safe-zero';

export const getRating = (
	level: PuzzleSet['level'],
	averageRating = 1500,
): [number, number] => {
	switch (level) {
		case 'easiest': {
			return [safeZero(averageRating - 600), safeZero(averageRating - 500)];
		}

		case 'easier': {
			return [safeZero(averageRating - 300), safeZero(averageRating - 200)];
		}

		case 'harder': {
			return [averageRating + 200, averageRating + 300];
		}

		case 'hardest': {
			return [averageRating + 500, averageRating + 600];
		}

		default: {
			return [averageRating - 50, averageRating + 50];
		}
	}
};
