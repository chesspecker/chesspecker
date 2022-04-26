import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const MainLayout = ({children}: {children: React.ReactNode}) => (
	<main className='  flex min-h-screen flex-col items-center justify-between bg-sky-700 bg-gradient-to-t from-slate-900 to-sky-700 relative '>
		<Navbar />
		<div className=' h-full w-full'>{children}</div>
		<div className='absolute bottom-0 w-full'>
			<Footer />
		</div>
	</main>
);

export default MainLayout;
