import type {ReactElement} from 'react';
import Image from 'next/image.js';
import {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import Layout from '@/layouts/login';
import {withSessionSsr} from '@/lib/session';
import {Button} from '@/components/button';

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
			<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
				Happy to see you
				<br />
				newcomer 👋
			</h1>
			<div className='w-full mx-0 my-3 text-center '>
				<Link href='/api/auth/lichess/login'>
					<a>
						<Button className='py-4'>SIGN IN WITH LICHESS</Button>
					</a>
				</Link>
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
