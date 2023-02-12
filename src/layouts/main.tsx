import {Footer} from '@/components/footer';
import {BottomTab} from '@/components/mobile/bottom-tab';
import {Navbar} from '@/components/navbar';

export const Layout = ({children}: {children: React.ReactNode}) => (
	<main>
		<div className='relative flex h-full min-h-screen flex-col items-center justify-between overflow-y-scroll bg-gradient-to-t from-slate-900 to-sky-700 font-sans text-white disable-scrollbars'>
			<Navbar />
			<div className='h-full w-full'>{children}</div>
			<div className='absolute bottom-0 w-full'>
				<Footer />
				<BottomTab />
			</div>
		</div>
	</main>
);
