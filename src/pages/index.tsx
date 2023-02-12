import Image from 'next/image';
import Link from 'next/link';
import {NextSeo} from 'next-seo';
import type {ReactElement} from 'react';
import {Button} from '@/components/button';
import {LoginLayout} from '@/layouts/login';

const Home = () => (
	<>
		<NextSeo title='⚔️ Welcome' />
		<div className='m-0 flex h-screen flex-col items-center justify-center'>
			<Image
				className='mx-auto mt-8 block h-40 w-40'
				src='/images/logo.svg'
				width='160'
				height='160'
				alt='Chesspecker Logo'
			/>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold'>
				Happy to see you
				<br />
				newcomer 👋
			</h1>
			<div className='mx-0 my-3 w-full text-center '>
				<Link href='/api/auth/login'>
					<Button className='py-4'>SIGN IN WITH LICHESS</Button>
				</Link>
			</div>
		</div>
	</>
);

Home.getLayout = (page: ReactElement) => <LoginLayout>{page}</LoginLayout>;

export default Home;
