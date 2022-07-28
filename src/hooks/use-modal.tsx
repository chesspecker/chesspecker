import {useCallback, useState} from 'react';

/**
 * Custom hook for handling common open/close/toggle scenarios
 */
const useModal = (initialState = false) => {
	const [isOpen, setIsOpen] = useState(initialState);
	const show = useCallback(() => {
		setIsOpen(() => true);
	}, []);

	const hide = useCallback(() => {
		setIsOpen(() => false);
	}, []);

	const toggle = useCallback(() => {
		setIsOpen(state => !state);
	}, []);

	return {isOpen, show, hide, toggle};
};

export default useModal;
