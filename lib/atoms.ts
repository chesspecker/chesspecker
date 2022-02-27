import {atom} from 'jotai';

import type {Category} from 'data/categories';
import type {Difficulty} from '@/models/puzzle-set-model';

export const selectedAtom = atom<Array<Category['id']>>([]);

export const optionsTitleAtom = atom<string>('');
export const optionsLevelAtom = atom<Difficulty>('normal');
export const optionsSizeAtom = atom<number>(500);

export type Board = 'brown' | 'green' | 'ruby' | 'purple' | 'teal';
export const boardAtom = atom<Board>('green');
export type Pieces = 'cburnett' | 'classic' | 'neo' | 'alpha' | 'bases';
export const piecesAtom = atom<Pieces>('neo');
export const soundAtom = atom<boolean>(true);
export const autoMoveAtom = atom<boolean>(true);

export const orientationAtom = atom<'white' | 'black'>('white');

export type Animation =
	| ''
	| 'animate-rightMove'
	| 'animate-wrongMove'
	| 'animate-finishMove';
export const animationAtom = atom<Animation>('');
