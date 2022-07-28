import type {ReactElement} from 'react';
import Link from 'next/link';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';

const ErrorPage = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen m-0 '>
			<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
				Looks like something went wrong...
			</h1>
			<div className='w-full mx-0 my-3 text-center '>
				<Link href='/dashboard'>
					<a>
						<Button className='py-4'>RETURN HOME</Button>
					</a>
				</Link>
			</div>
		</div>
	);
};

ErrorPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default ErrorPage;
