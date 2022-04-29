import {useState, useEffect} from 'react';
// FIXME: is needed ?
// import useShouldShowPrompt from 'app/shared/hooks/useShouldShowPrompt';

const useWebInstallPrompt = (): [boolean, boolean] => {
	const [hasInstalled, setHasInstalled] = useState<boolean>();
	const [isIos, setIsIos] = useState<boolean>();

	useEffect(() => {
		const isIOS = (): boolean => {
			const ua = window.navigator.userAgent;
			const isIPad = Boolean(/ipad/i.test(ua));
			const isIPhone = Boolean(/iphone/i.test(ua));
			return isIPad || isIPhone;
		};

		setIsIos(isIOS());

		const isStandalone = (): boolean => {
			if (window.matchMedia('(display-mode: standalone)').matches && !isIOS()) {
				return true;
			}

			return false;
		};

		if (isStandalone()) {
			setHasInstalled(true);
		} else {
			setHasInstalled(false);
		}

		/* FIXME: Fix
		console.log('**************here we are***********', isStandalone());
		const beforeInstallPromptHandler = event => {
			event.preventDefault();
			console.log('here we are');
			// check if user has already been asked

		};
		window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
		return () =>
			window.removeEventListener(
				'beforeinstallprompt',
				beforeInstallPromptHandler,
			); */
	}, []);

	return [hasInstalled, isIos];
};

export default useWebInstallPrompt;
