import type {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Image from 'next/image.js';
import type {ReactElement} from 'react';
import {withSessionSsr} from '@/lib/session';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';

const IndexPage = () => (
	<>
		<NextSeo title='⚔️ Welcome' />
		<div className='m-0 flex h-screen flex-col items-center justify-center '>
			<Image
				className='mx-auto mt-8 block h-40 w-40'
				src='/images/logo.svg'
				width='160px'
				height='160px'
			/>
			<div className='mx-0 w-full max-w-md justify-center'>
				<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold'>
					Chesspecker is currently out of service.
				</h1>
			</div>
			<div className='mx-auto my-3 flex w-full flex-col items-center justify-center gap-8 text-center'>
				<a
					href='https://discord.com/invite/qDftJZBBHa'
					target='_blank'
					rel='noreferrer'
				>
					<Button className='min-w-full items-center py-4'>GET INVOLVED</Button>
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
