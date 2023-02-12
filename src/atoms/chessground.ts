import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import type {Board, Pieces} from '@/types/chessground';

export type Animation =
	| ''
	| 'animate-rightMove'
	| 'animate-wrongMove'
	| 'animate-finishMove';
export const animationAtom = atom<Animation>('');

export const orientationColorAtom = atom<'white' | 'black'>('white');
export const isBoardRevertedAtom = atom<boolean>(false);

const board = atomWithStorage<Board>('cp-board', 'green');
const pieces = atomWithStorage<Pieces>('cp-pieces', 'neo');
export const themeµ = {board, pieces};

const sound = atomWithStorage<boolean>('cp-sound', true);
const animation = atomWithStorage<boolean>('cp-animation', true);
const autoMove = atomWithStorage<boolean>('cp-automove', true);
export const hasClock = atomWithStorage<boolean>('cp-clock', true);
export const configµ = {autoMove, board, pieces, sound, hasClock, animation};
