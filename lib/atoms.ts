import {atom} from 'jotai';

import type {Category} from 'data/categories';

export const selectedAtom = atom<Array<Category['id']>>([]);

export const optsTitleAtom = atom<string>('');
export const optsLevelAtom = atom<string>('normal');
export const optsSizeAtom = atom<number>(500);
