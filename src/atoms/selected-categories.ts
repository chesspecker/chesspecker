import {atom} from 'jotai';
import type {Category} from '@/data/categories';

export const selectedCategoriesAtom = atom<Array<Category['id']>>([]);
