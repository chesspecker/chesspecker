import {useEffect} from 'react';

type Props = {
	targetKey: string;
	fn: () => Promise<any> | void;
};

const useKeyPress = ({targetKey, fn}: Props) => {
	useEffect(() => {
		const handleKeyPress = async ({key}) => {
			if (key === targetKey) {
				await fn();
			}
		};

		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, []);
};

export default useKeyPress;
