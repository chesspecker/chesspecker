import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

import type {Category} from 'data/categories';
import type {Difficulty} from '@/models/puzzle-set-model';

export const selectedAtom = atom<Array<Category['id']>>([]);

export const optionsTitleAtom = atom<string>('');
export const optionsLevelAtom = atom<Difficulty>('normal');
export const optionsSizeAtom = atom<number>(500);

export type Board = 'brown' | 'green' | 'ruby' | 'purple' | 'teal';
export const boardAtom = atomWithStorage<Board>('cp-board', 'green');
export type Pieces = 'cburnett' | 'classic' | 'neo' | 'alpha' | 'bases';
export const piecesAtom = atomWithStorage<Pieces>('cp-pieces', 'neo');
export const soundAtom = atomWithStorage<boolean>('cp-sound', true);
export const autoMoveAtom = atomWithStorage<boolean>('cp-automove', true);

export const orientationAtom = atom<'white' | 'black'>('white');

export type Animation =
	| ''
	| 'animate-rightMove'
	| 'animate-wrongMove'
	| 'animate-finishMove';
export const animationAtom = atom<Animation>('');

export const get_ = (value: string): any =>
	JSON.parse(localStorage.getItem(value) || 'null');
export const set_ = (key: string, value: any) => {
	localStorage.setItem(key, JSON.stringify(value));
};
