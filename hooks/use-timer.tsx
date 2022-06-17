import {useCallback, useEffect, useState} from 'react';

const useTimer = (initialTime = 0) => {
	const [timer, setTimer] = useState({value: initialTime, isRunning: true});
	/**
	 * Setup timer.
	 */
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
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
		switch (value) {
			case undefined: {
				setTimer(timer => ({...timer, isRunning: !timer.isRunning}));
				break;
			}

			case true: {
				setTimer(timer => ({...timer, isRunning: true}));
				break;
			}

			case false:
			default: {
				setTimer(timer => ({...timer, isRunning: false}));
				break;
			}
		}
	}, []);

	const updateTimer = useCallback((value: number) => {
		setTimer(timer => ({...timer, value}));
	}, []);

	return {timer, updateTimer, isTimerOn: timer.isRunning, toggleTimer};
};

export default useTimer;
