import {useCallback, useEffect, useState} from 'react';

const useTimer = (initialTime = 0) => {
	const [timer, setTimer] = useState({value: initialTime, isRunning: true});
	/**
	 * Setup timer.
	 */
	useEffect(() => {
		let interval: NodeJS.Timeout | undefined;
		if (timer.isRunning) {
			interval = setInterval(() => {
				setTimer(timer => ({...timer, value: timer.value + 1}));
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [timer]);

	const toggleTimer = useCallback((value?: boolean) => {
		setTimer(timer => ({
			...timer,
			isRunning: value || !timer.isRunning,
		}));
	}, []);

	const updateTimer = useCallback((value: number) => {
		setTimer(timer => ({...timer, value}));
	}, []);

	return {timer, updateTimer, isTimerOn: timer.isRunning, toggleTimer};
};

export default useTimer;
