import type {ReactElement} from 'react';
import Image from 'next/image.js';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';

const IndexPage = () => (
	<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
		<Image
			className='mx-auto mt-8 block h-40 w-40'
			src='/images/logo.svg'
			width='160px'
			height='160px'
		/>
		<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
			Happy to see you
			<br />
			newcomer 👋
		</h1>
		<div className='my-3 mx-0 w-full text-center text-white'>
			<Button href='/api/auth/login'>SIGN IN WITH LICHESS</Button>
		</div>
	</div>
);

IndexPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default IndexPage;
