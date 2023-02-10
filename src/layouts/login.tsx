import {useAtom} from 'jotai';
import {useEffect, useState} from 'react';
import {darkModeµ} from '../lib/atoms';

const LoginLayout = ({children}: {children: React.ReactNode}) => {
	const [isDarkMode] = useAtom(darkModeµ);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setDarkMode(isDarkMode);
	}, [isDarkMode]);

	return (
		<main className={` ${darkMode ? 'dark' : ''}`}>
			<div className='relative flex h-full min-h-screen flex-col items-center justify-between overflow-y-scroll bg-gradient-to-t from-white to-white font-sans text-sky-900 disable-scrollbars dark:from-slate-900 dark:to-sky-700 dark:text-white'>
				{children}
			</div>
		</main>
	);
};

export default LoginLayout;
