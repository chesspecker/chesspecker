import type {ReactElement} from 'react';
import Image from 'next/image.js';
import {GetServerSidePropsContext, Redirect} from 'next';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';
import {withSessionSsr} from '@/lib/session';

const IndexPage = () => (
	<div className='flex flex-col items-center justify-center h-screen m-0 text-slate-800'>
		<Image
			className='block w-40 h-40 mx-auto mt-8'
			src='/images/logo.svg'
			width='160px'
			height='160px'
		/>
		<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center text-white'>
			Happy to see you
			<br />
			newcomer 👋
		</h1>
		<div className='w-full mx-0 my-3 text-center text-white'>
			<Button className='py-4' href='/api/auth/login'>
				SIGN IN WITH LICHESS
			</Button>
		</div>
	</div>
);

IndexPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default IndexPage;

export const getServerSideProps = withSessionSsr(
	async ({req}: GetServerSidePropsContext) => {
		if (req?.session?.userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/dashboard'};
			return {redirect};
		}

		return {props: {}};
	},
);
