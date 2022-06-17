import type {NextApiResponse} from 'next';
import type {ErrorData} from '@/types/data';

export const shuffle = <T>(array: T[]): T[] => {
	let currentIndex = array.length;
	let temporary: T;
	let rnd: number;

	while (currentIndex !== 0) {
		rnd = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporary = array[currentIndex];
		array[currentIndex] = array[rnd];
		array[rnd] = temporary;
	}

	return array;
};

export const sortBy = <T>(array: T[], p: string): T[] =>
	// @ts-expect-error @typescript-eslint/restrict-template-expressions
	[...array].sort((a, b) => (a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0));

export const safeZero = (value: number) => Math.max(value, 0);

export const formattedDate = (date: Date): string =>
	date.toLocaleString('en-US').split(',')[0];

export const getRandomInt = (max: number): number =>
	Math.floor(Math.random() * max);

export const failWrapper =
	(response: NextApiResponse<ErrorData>) =>
	(error: string, status = 500): void => {
		console.error('Error:', error);
		response.status(status).json({success: false, error});
	};
