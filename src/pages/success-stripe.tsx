import {ReactElement} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import {GetServerSidePropsContext, Redirect} from 'next';
import Layout from '@/layouts/login';
import {Button, ButtonLink} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import {User} from '@/models/user';
import {checkForAchievement} from '@/lib/achievements';
import {formattedDate} from '@/lib/utils';
import {withSessionSsr} from '@/lib/session';
import {get_, update_} from '@/lib/api-helpers';
import {AchivementsArgs} from '@/types/models';

type Props = {
	user: User;
	sessionId: string;
};

const SuccessPage = ({user, sessionId}: Props) => {
	useEffectAsync(async () => {
		const response = await get_.session(sessionId);
		if (!response.success) return;
		const id = user._id.toString();
		const data = {
			$set: {
				isSponsor: true,
				stripeId: response.data?.customer,
			},
		};
		await update_.user(id, data);
	}, []);

	const handleClick = async () => {
		const today = new Date();
		const currentDate = formattedDate(today);
		const body: AchivementsArgs = {
			streakMistakes: 0,
			streakTime: 0,
			completionTime: 0,
			completionMistakes: 0,
			totalPuzzleSolved: 0,
			themes: [],
			streak: {
				currentCount: 0,
				startDate: currentDate,
				lastLoginDate: currentDate,
			},
			isSponsor: true,
		};
		await checkForAchievement(body);
	};

	return (
		<>
			<NextSeo title='🎉 Success' />
			<div className='flex flex-col items-center justify-center min-h-screen pt-12 md:pt-24 pb-20'>
				{useConffeti()}
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center'>
					Thanks for helping chesspecker grow!
				</h1>
				<p className='mx-2 text-center'>
					Join us on Discord to share your ideas and desires for Chesspecker 🎉
				</p>
				<div className='flex flex-col items-center justify-center w-full mx-0 my-3 text-center'>
					<ButtonLink href='https://discord.gg/qDftJZBBHa'>
						JOIN DISCORD! 🔥
					</ButtonLink>
					<Link href='/dashboard'>
						<a>
							<Button onClick={handleClick}>BACK TO DASHBOAD 🏠</Button>
						</a>
					</Link>
				</div>
			</div>
		</>
	);
};

SuccessPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SuccessPage;

export const getServerSideProps = withSessionSsr(
	async ({req, query}: GetServerSidePropsContext) => {
		const userID = req.session?.userID;
		const redirect: Redirect = {statusCode: 303, destination: '/'};
		if (!userID) return {redirect};

		const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
		const baseUrl = req ? `${protocol}://${req.headers.host!}` : '';
		const response = await get_.user(userID, baseUrl);
		if (!response?.success) return {redirect};

		const sessionId = query?.session_id as string;
		if (!sessionId) return {redirect};

		return {
			props: {
				user: response.data,
				sessionId,
			},
		};
	},
);
