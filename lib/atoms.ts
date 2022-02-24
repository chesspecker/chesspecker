import {atom} from 'jotai';

import type {Category} from 'data/categories';

export const selectedAtom = atom<Array<Category['id']>>([]);

export const optionsTitleAtom = atom<string>('');
export const optionsLevelAtom = atom<string>('normal');
export const optionsSizeAtom = atom<number>(500);
