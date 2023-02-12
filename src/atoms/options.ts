import {Difficulty} from '@prisma/client';
import {atom} from 'jotai';

export const optionsTitleAtom = atom<string>('');
export const optionsLevelAtom = atom<Difficulty>(Difficulty.intermediate);
export const optionsSizeAtom = atom<number>(500);
