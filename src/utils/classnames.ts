import {twMerge} from 'tailwind-merge';

export type Cn = (
	...args: Array<undefined | null | string | boolean>
) => string;

export const cn: Cn = (...args) =>
	twMerge(
		args
			.flat()
			.filter(x => x !== null && x !== undefined && typeof x !== 'boolean')
			.join(' '),
	);
