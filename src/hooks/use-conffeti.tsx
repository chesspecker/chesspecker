import Confetti from 'react-confetti';
import {useWindowSize} from '@/hooks/use-window-size';

export const useConfetti = () => {
	const {width, height} = useWindowSize();
	return (
		<Confetti width={width} height={height} recycle={false} gravity={0.05} />
	);
};
