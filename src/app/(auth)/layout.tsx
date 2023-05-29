import {Navbar} from '@/components/layout/navbar';
import {PropsWithChildren} from 'react';

const Layout = ({children}: PropsWithChildren) => (
	<div className='w-full h-full'>
		<Navbar />
		{children}
	</div>
);

export default Layout;
