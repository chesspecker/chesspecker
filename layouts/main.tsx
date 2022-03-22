import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const MainLayout = ({children}: {children: React.ReactNode}) => (
	<main className='  flex min-h-screen flex-col items-center justify-center bg-sky-700 bg-gradient-to-t from-slate-900 to-sky-700 '>
		<Navbar />
		<div className='mt-10 mb-20'>{children}</div>
		<Footer />
	</main>
);

export default MainLayout;
