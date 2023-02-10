import type {ReactElement} from 'react';
import Link from 'next/link';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';

const CancelPage = () => (
	<div className='m-0 flex h-screen flex-col items-center justify-center '>
		<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold '>
			Looks like something went wrong...
		</h1>
		<div className='mx-0 my-3 w-full text-center '>
			<Link href='/dashboard'>
				<a>
					<Button className='py-4'>RETURN HOME</Button>
				</a>
			</Link>
		</div>
	</div>
);

CancelPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default CancelPage;
