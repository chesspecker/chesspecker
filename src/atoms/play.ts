import {atom} from 'jotai';
import type {Animation} from '@/types/animation';

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
