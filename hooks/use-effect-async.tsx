import {useEffect} from 'react';
import type {DependencyList} from 'react';

const useEffectAsync = (effect: () => any, inputs: DependencyList) => {
	useEffect(() => {
		effect();
	}, inputs);
};

export default useEffectAsync;
