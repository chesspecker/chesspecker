import {useAtom} from 'jotai';
import {useEffect, useState} from 'react';
import {darkModeµ} from '../lib/atoms';

const LoginLayout = ({children}: {children: React.ReactNode}) => {
	const [isDarkMode] = useAtom(darkModeµ);
	const [_darkMode, _setDarkMode] = useState(false);

	useEffect(() => {
		_setDarkMode(isDarkMode);
	}, [isDarkMode]);
	return (
		<main className={` ${_darkMode && 'dark'}`}>
			<div className='relative flex flex-col items-center justify-between h-full min-h-screen overflow-y-scroll font-sans dark:text-white text-sky-900 disable-scrollbars bg-gradient-to-t dark:from-slate-900 from-white to-white dark:to-sky-700'>
				{children}
			</div>
		</main>
	);
};

export default LoginLayout;
