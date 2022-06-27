import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import type {Category} from 'data/categories';
import {Difficulty, Animation} from '@/types/models';

export const darkModeµ = atomWithStorage<boolean>('cp-dark-mode', true);

export const selectedAtom = atom<Array<Category['id']>>([]);
export const ratingAtom = atom<number>(1500);
export const supportBannerµ = atomWithStorage<boolean>(
	'cp-banner-visible',
	true,
);

const optionsTitleAtom = atom<string>('');
const optionsLevelAtom = atom<Difficulty>(Difficulty.normal);
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
export const themeµ = {board, pieces};

const sound = atomWithStorage<boolean>('cp-sound', true);
const animation = atomWithStorage<boolean>('cp-animation', true);
const autoMove = atomWithStorage<boolean>('cp-automove', true);
export const hasClock = atomWithStorage<boolean>('cp-clock', true);
export const configµ = {autoMove, board, pieces, sound, hasClock, animation};

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

const color = atom<'white' | 'black'>('white');
const reverted = atom<boolean>(false);

export const orientationµ = {
	color,
	reverted,
};

export const animationµ = atom<Animation>('');

export const getStorage = <T>(value: string): T =>
	JSON.parse(localStorage.getItem(value) ?? 'null') as T;
