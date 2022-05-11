import {ReactElement, useState, useEffect} from 'react';
import Stripe from 'stripe';
import {useRouter} from 'next/router';
import {NextSeo} from 'next-seo';
import Layout from '@/layouts/login';
import {ButtonLink as Button, ButtonLink} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import useUser from '@/hooks/use-user';
import {AchivementsArgs, UserInterface} from '@/types/models';
import {checkForAchievement} from '@/lib/achievements';
import {formattedDate} from '@/lib/utils';

const SuccessPage = () => {
	const router = useRouter();
	const data = useUser();
	const [user, setUser] = useState<UserInterface>();
	const {session_id: sessionId} = router.query;
	const [session, setSession] = useState<Stripe.Checkout.Session>();

	const updateUser = {
		$set: {
			isSponsor: true,
			stripeId: session?.customer && session.customer,
		},
	};

	useEffectAsync(async () => {
		const today = new Date();
		const currentDate = formattedDate(today);
		const body: AchivementsArgs = {
			streakMistakes: 0,
			streakTime: 0,
			completionTime: 0,
			completionMistakes: 0,
			totalPuzzleSolved: 0,
			themes: [],
			totalSetSolved: 0,
			streak: {
				currentCount: 0,
				startDate: currentDate,
				lastLoginDate: currentDate,
			},
			isSponsor: true,
		};
		await checkForAchievement(body);
	}, []);

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);

	useEffectAsync(async () => {
		if (!sessionId || !user) return;
		const data = await fetch(
			`/api/checkout-sessions/${sessionId as string}`,
		).then(
			async response => response.json() as Promise<Stripe.Checkout.Session>,
		);
		setSession(data);

		await fetch(`/api/user/${user._id.toString()}`, {
			method: 'PUT',
			body: JSON.stringify(updateUser),
		});
	}, [sessionId, user]);

	return (
		<>
			<NextSeo
				title='ChessPecker | Success-sponsor'
				description='Join us on Discord to share your ideas and desires for Chesspecker'
			/>
			<div className='flex flex-col items-center justify-center min-h-screen pt-24 pb-20  '>
				{useConffeti()}
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
					Thanks for helping chesspecker grow!
				</h1>
				<p className='mx-2 text-center'>
					Join us on Discord to share your ideas and desires for Chesspecker 🎉
				</p>
				<div className='w-full mx-0 my-3 flex flex-col text-center items-center justify-center '>
					<ButtonLink href='https://discord.gg/qDftJZBBHa'>
						JOIN DISCORD ! 🔥{' '}
					</ButtonLink>
					<Button href='/dashboard'>BACK TO DASHBOAD 🏠 </Button>
				</div>
			</div>
		</>
	);
};

SuccessPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SuccessPage;
