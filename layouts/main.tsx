import Footer from '@/components/footer';
import BottomTab from '@/components/mobile-assets/bottom-tab';
import Navbar from '@/components/navbar';

const MainLayout = ({children}: {children: React.ReactNode}) => (
	<main className='relative flex flex-col items-center justify-between h-full min-h-screen overflow-y-scroll font-sans disable-scrollbars bg-sky-700 bg-gradient-to-t from-slate-900 to-sky-700'>
		<Navbar />
		<div className='w-full h-full'>{children}</div>
		<div className='absolute bottom-0 w-full'>
			<Footer />
			<BottomTab />
		</div>
	</main>
);

export default MainLayout;
