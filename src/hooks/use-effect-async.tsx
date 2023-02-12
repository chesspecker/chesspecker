import {useEffect} from 'react';
import type {DependencyList} from 'react';

export const useEffectAsync = (effect: () => any, inputs: DependencyList) => {
	useEffect(() => {
		effect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, inputs);
};
