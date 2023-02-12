import type {ReactElement} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import type {User} from '@prisma/client';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {LoginLayout} from '@/layouts/login';
import {Button} from '@/components/button';
import {useConfetti} from '@/hooks/use-conffeti';
import {withSessionSsr} from '@/lib/session';

const SuccessLogin = ({user}: {user: User}) => (
	<>
		<NextSeo title='🎉 Success' />
		<div className='m-0 flex h-screen flex-col items-center justify-center'>
			{useConfetti()}
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold'>
				Hello {user?.username}{' '}
				<span role='img' aria-label='waving hand'>
					👋
				</span>
				<br /> Welcome to chesspecker
			</h1>
			<div className='mx-0 my-3 w-4/5 text-center'>
				<Link href='/dashboard'>
					<Button className='py-4'>
						LET&apos;S GO!{' '}
						<span role='img' aria-label='fire'>
							🔥
						</span>
					</Button>
				</Link>
			</div>
		</div>
	</>
);

SuccessLogin.getLayout = (page: ReactElement) => (
	<LoginLayout>{page}</LoginLayout>
);

export default SuccessLogin;

export const getServerSideProps = withSessionSsr(
	({req}: GetServerSidePropsContext) => {
		if (!req?.session?.user?.id) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		return {
			props: {
				user: req?.session?.user,
			},
		};
	},
);
