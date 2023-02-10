import {useAtom} from 'jotai';
import {useState, useEffect} from 'react';
import {darkModeµ} from '@/lib/atoms';
import Footer from '@/components/footer';
import BottomTab from '@/components/mobile-assets/bottom-tab';
import Navbar from '@/components/navbar';

const MainLayout = ({children}: {children: React.ReactNode}) => {
	const [isDarkMode] = useAtom(darkModeµ);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setDarkMode(isDarkMode);
	}, [isDarkMode]);

	return (
		<main className={`${darkMode ? 'dark' : ''}`}>
			<div className='relative flex h-full min-h-screen flex-col items-center justify-between overflow-y-scroll bg-gradient-to-t from-white to-white font-sans text-sky-900 disable-scrollbars dark:from-slate-900 dark:to-sky-700 dark:text-white'>
				<Navbar />
				<div className='h-full w-full'>{children}</div>
				<div className='absolute bottom-0 w-full'>
					<Footer />
					<BottomTab />
				</div>
			</div>
		</main>
	);
};

export default MainLayout;
