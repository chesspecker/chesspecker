import {atom} from 'jotai';

import type {Category} from 'data/categories';

export const selectedAtom = atom<Array<Category['id']>>([]);
