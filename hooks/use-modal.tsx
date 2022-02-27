import {useState} from 'react';

/**
 * Custom hook for handling common open/close/toggle scenarios
 */
const useModal = (initialState = false) => {
	const [isOpen, setOpen] = useState(initialState);
	const show = () => {
		setOpen(() => true);
	};

	const hide = () => {
		setOpen(() => false);
	};

	const toggle = () => {
		setOpen(state => !state);
	};

	return {isOpen, show, hide, toggle};
};

export default useModal;
