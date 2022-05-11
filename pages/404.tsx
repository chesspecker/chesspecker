import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';

const CancelPage = () => {
	const router = useRouter();

	return (
		<div className='flex flex-col items-center justify-center h-screen m-0 '>
			<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
				Looks like you are lost..
			</h1>
			<div className='w-full mx-0 my-3 text-center '>
				<Button
					className='py-4'
					onClick={async () => router.push('/dashboard')}
				>
					RETURN HOME
				</Button>
			</div>
		</div>
	);
};

CancelPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default CancelPage;
