import type {ReactElement} from 'react';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useUser from '@/hooks/use-user';

const IndexPage = () => (
	<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
		{useConffeti()}
		<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
			Hello {useUser()?.data?.username} 👋 <br /> Welcome to chesspecker
		</h1>
		<div className='my-3 mx-0 w-full text-center text-white'>
			<Button href='/dashboard'>LET&apos;S GO! 🔥</Button>
		</div>
	</div>
);

IndexPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default IndexPage;
