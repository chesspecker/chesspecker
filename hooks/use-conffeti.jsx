import Confetti from 'react-confetti';
import useWindowSize from './use-window-size';

export default function useConfetti() {
	const {width, height} = useWindowSize();
	return (
		<Confetti width={width} height={height} recycle={false} gravity={0.05} />
	);
}
