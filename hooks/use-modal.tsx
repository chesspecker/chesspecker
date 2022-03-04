import {useCallback, useState} from 'react';

/**
 * Custom hook for handling common open/close/toggle scenarios
 */
const useModal = (initialState = false) => {
	const [isOpen, setOpen] = useState(initialState);
	const show = useCallback(() => {
		setOpen(() => true);
	}, []);

	const hide = useCallback(() => {
		setOpen(() => false);
	}, []);

	const toggle = useCallback(() => {
		setOpen(state => !state);
	}, []);

	return {isOpen, show, hide, toggle};
};

export default useModal;
