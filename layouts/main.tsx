import Footer from '@/components/footer';
import BottomTab from '@/components/mobile-assets/bottom-tab';
import Navbar from '@/components/navbar';

const MainLayout = ({children}: {children: React.ReactNode}) => (
	<main className='  relative disable-scrollbars flex min-h-screen h-full overflow-y-scroll flex-col items-center justify-between bg-sky-700 bg-gradient-to-t from-slate-900 to-sky-700 '>
		<Navbar />
		<div className=' h-full w-full'>{children}</div>
		<div className='absolute bottom-0 w-full'>
			<Footer />
			<BottomTab />
		</div>
	</main>
);

export default MainLayout;
