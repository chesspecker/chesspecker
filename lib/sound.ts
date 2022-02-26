import MOVE from '@/sounds/Move.mp3';
import CAPTURE from '@/sounds/Capture.mp3';
import ERROR from '@/sounds/Error.mp3';
import GENERIC from '@/sounds/GenericNotify.mp3';
import VICTORY from '@/sounds/Victory.mp3';

type Sound = 'MOVE' | 'CAPTURE' | 'ERROR' | 'GENERIC' | 'VICTORY';

const play = async (src: string) => new Audio(src).play();

const audio = async (sound: Sound, hasSound = true) => {
	if (!hasSound) return;

	switch (sound) {
		case 'MOVE':
			return play(MOVE);

		case 'CAPTURE':
			return play(CAPTURE);

		case 'ERROR':
			return play(ERROR);

		case 'VICTORY':
			return play(VICTORY);

		case 'GENERIC':
		default:
			return play(GENERIC);
	}
};

export default audio;
