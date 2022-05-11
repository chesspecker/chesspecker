import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import {NextSeo} from 'next-seo';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useUser from '@/hooks/use-user';
import audio from '@/lib/sound';

const IndexPage = () => {
	const router = useRouter();
	const handleClick = async () => {
		await audio('VICTORY', true, 0);
		await router.push('/dashboard');
	};

	return (
		<>
			<NextSeo
				title='ChessPecker | Success'
				description='Welcome to chessPecker website, the only app to practice woodpecker methode !'
			/>
			<div className='flex flex-col items-center justify-center h-screen m-0 '>
				{useConffeti()}
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
					Hello {useUser()?.user?.username} 👋 <br /> Welcome to chesspecker
				</h1>
				<div className='w-full mx-0 my-3 text-center '>
					<Button className='py-4' onClick={handleClick}>
						LET&apos;S GO! 🔥
					</Button>
				</div>
			</div>
		</>
	);
};

IndexPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default IndexPage;
