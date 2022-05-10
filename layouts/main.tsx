import {useAtom} from 'jotai';
import {darkModeµ} from '@/lib/atoms';
import Footer from '@/components/footer';
import BottomTab from '@/components/mobile-assets/bottom-tab';
import Navbar from '@/components/navbar';
import {useState, useEffect} from 'react';

const MainLayout = ({children}: {children: React.ReactNode}) => {
	const [isDarkMode] = useAtom(darkModeµ);
	const [_darkMode, _setDarkMode] = useState(false);

	useEffect(() => {
		_setDarkMode(isDarkMode);
	}, [isDarkMode]);

	return (
		<main className={`${_darkMode && 'dark'}`}>
			<div className='relative flex flex-col items-center justify-between h-full min-h-screen overflow-y-scroll font-sans dark:text-white text-sky-900 disable-scrollbars bg-gradient-to-t dark:from-slate-900 from-white to-white dark:to-sky-700'>
				<Navbar />
				<div className='w-full h-full'>{children}</div>
				<div className='absolute bottom-0 w-full'>
					<Footer />
					<BottomTab />
				</div>
			</div>
		</main>
	);
};

export default MainLayout;
