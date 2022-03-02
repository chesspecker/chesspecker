import {useCallback, useEffect, useState} from 'react';

const useTimer = (initialTime = 0) => {
	const [timer, setTimer] = useState(initialTime);
	const [isTimerOn, setIsTimerOn] = useState(true);
	/**
	 * Setup timer.
	 */
	useEffect(() => {
		let interval = null;
		if (isTimerOn) {
			interval = setInterval(() => {
				setTimer(lastCount => lastCount + 1);
			}, 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [isTimerOn]);

	const toggleTimer = useCallback((value?: boolean) => {
		switch (value) {
			case undefined: {
				setIsTimerOn(state => !state);
				break;
			}

			case true: {
				setIsTimerOn(true);
				break;
			}

			case false:
			default: {
				setIsTimerOn(false);
				break;
			}
		}
	}, []);

	const updateTimer = useCallback((value: number) => {
		setTimer(() => value);
	}, []);

	return {timer, updateTimer, isTimerOn, toggleTimer};
};

export default useTimer;
