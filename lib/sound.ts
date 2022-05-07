import MOVE from '@/sounds/Move.mp3';
import CAPTURE from '@/sounds/Capture.mp3';
import ERROR from '@/sounds/Error.mp3';
import GENERIC from '@/sounds/GenericNotify.mp3';
import VICTORY from '@/sounds/Victory.mp3';

type Sound = 'MOVE' | 'CAPTURE' | 'ERROR' | 'GENERIC' | 'VICTORY';

const isIOS = (): boolean => {
	const ua = window.navigator.userAgent;
	const isIPad = Boolean(/ipad/i.test(ua));
	const isIPhone = Boolean(/iphone/i.test(ua));
	return isIPad || isIPhone;
};

const isSafari = (): boolean => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const play = async (src: string, volume: HTMLMediaElement['volume']) => {
	if (isIOS() || isSafari()) return;
	const audio = new Audio(src);
	audio.volume = volume;
	return audio.play();
};

const audio = async (sound: Sound, hasSound = true, volume = 0.6) => {
	if (!hasSound) return;

	switch (sound) {
		case 'MOVE':
			return play(MOVE, volume);

		case 'CAPTURE':
			return play(CAPTURE, volume);

		case 'ERROR':
			return play(ERROR, volume);

		case 'VICTORY':
			return play(VICTORY, volume);

		case 'GENERIC':
		default:
			return play(GENERIC, volume);
	}
};

export default audio;
