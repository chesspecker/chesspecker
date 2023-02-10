import type {NextApiResponse} from 'next';
import type {ErrorData} from '@/types/data';

export const shuffle = <T>(array: T[]): T[] => {
	let currentIndex = array.length;
	let temporary: T;
	let rnd: number;

	while (currentIndex !== 0) {
		rnd = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporary = array[currentIndex] as T;
		array[currentIndex] = array[rnd] as T;
		array[rnd] = temporary;
	}

	return array;
};

export const sortBy = <T>(array: T[], p: string): T[] =>
	// @ts-expect-error @typescript-eslint/restrict-template-expressions
	[...array].sort((a, b) => (a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0));

export const safeZero = (value: number) => Math.max(value, 0);

export const formattedDate = (date: Date): string =>
	date.toLocaleString('en-US').split(',')[0]!;

/* eslint-disable-next-line no-promise-executor-return */
export const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms));

export const INFINITY = Number.POSITIVE_INFINITY;

export const reducer = (
	accumulator: number | undefined,
	current: number | undefined,
) => (accumulator && current ? accumulator + current : 0);

export const summer = (arrays: number[][]): number[] =>
	arrays.reduce<number[]>(
		(acc: number[], array) => acc.map((sum, i) => sum + array[i]!),
		/* eslint-disable-next-line unicorn/no-new-array */
		new Array(arrays[0]!.length).fill(0),
	);

export const classNames = (...classes: string[]) =>
	classes.filter(Boolean).join(' ');

export const getRandomInt = (max: number): number =>
	Math.floor(Math.random() * max);

export const groupBy = <T>(array: T[], predicate: (v: T) => string) =>
	array.reduce<{[key: string]: T[]}>((acc, value) => {
		(acc[predicate(value)] ||= []).push(value);
		return acc;
	}, {});

export const failWrapper =
	(response: NextApiResponse<ErrorData>) =>
	(error: string, status = 500): void => {
		console.error('Error:', error);
		response.status(status).json({success: false, error});
	};
