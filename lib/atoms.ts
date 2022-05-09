import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

import type {Category} from 'data/categories';
import type {Difficulty} from '@/types/models';

export const darkModeµ = atomWithStorage<boolean>('cp-dark-mode', false);

export const selectedAtom = atom<Array<Category['id']>>([]);
export const ratingAtom = atom<number>(1500);

const optionsTitleAtom = atom<string>('');
const optionsLevelAtom = atom<Difficulty>('normal');
const optionsSizeAtom = atom<number>(500);
export const optionsµ = {
	title: optionsTitleAtom,
	level: optionsLevelAtom,
	size: optionsSizeAtom,
};

export type Board = 'brown' | 'green' | 'ruby' | 'purple' | 'teal';
export type Pieces = 'cburnett' | 'classic' | 'neo' | 'alpha' | 'bases';

const board = atomWithStorage<Board>('cp-board', 'green');
const pieces = atomWithStorage<Pieces>('cp-pieces', 'neo');
const sound = atomWithStorage<boolean>('cp-sound', true);
const autoMove = atomWithStorage<boolean>('cp-automove', true);
export const configµ = {autoMove, board, pieces, sound};

const totalPuzzles = atom<number>(0);
const completedPuzzles = atom<number>(0);
const initialPuzzleTimer = atom<number>(0);
const isSolutionClicked = atom<boolean>(false);
const isComplete = atom<boolean>(false);
export const playµ = {
	totalPuzzles,
	completed: completedPuzzles,
	timer: initialPuzzleTimer,
	solution: isSolutionClicked,
	isComplete,
};

export const orientationµ = atom<'white' | 'black'>('white');

export type Animation =
	| ''
	| 'animate-rightMove'
	| 'animate-wrongMove'
	| 'animate-finishMove';
export const animationµ = atom<Animation>('');

export const get_ = (value: string): any =>
	JSON.parse(localStorage.getItem(value) || 'null');
export const set_ = (key: string, value: any) => {
	localStorage.setItem(key, JSON.stringify(value));
};
