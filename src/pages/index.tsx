import {Button} from '@/components/button';
import Layout from '@/layouts/login';
import {withSessionSsr} from '@/lib/session';
import {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Image from 'next/image.js';
import type {ReactElement} from 'react';

const IndexPage = () => (
	<>
		<NextSeo title='⚔️ Welcome' />
		<div className='flex flex-col items-center justify-center h-screen m-0 '>
			<Image
				className='block w-40 h-40 mx-auto mt-8'
				src='/images/logo.svg'
				width='160px'
				height='160px'
			/>
			<div className='mx-0 w-full justify-center max-w-md'>
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center'>
					Chesspecker is currently out of service.
				</h1>
			</div>
			<div className='w-full mx-auto my-3 text-center justify-center items-center flex flex-col gap-8'>
				<a href='https://discord.com/invite/qDftJZBBHa' target='_blank'>
					<Button className='py-4 items-center min-w-full'>GET INVOLVED</Button>
				</a>
			</div>
		</div>
	</>
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
