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

/* eslint-disable-next-line no-promise-executor-return */
export const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms));

export const reducer = (accumulator: number, current: number) =>
	accumulator + current;

export const classNames = (...classes: string[]) =>
	classes.filter(Boolean).join(' ');

export const getRandomInt = (max: number): number =>
	Math.floor(Math.random() * max);

export const fetcher = async <T>(url: string): Promise<T> =>
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-return */
	fetch(url).then(async response => response.json());

export const failWrapper =
	(response: NextApiResponse<ErrorData>) =>
	(error: string, status = 500): void => {
		console.error('Error:', error);
		response.status(status).json({success: false, error});
	};
