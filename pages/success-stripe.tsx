import {ReactElement, useState, useEffect} from 'react';
import Stripe from 'stripe';
import {useRouter} from 'next/router';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';
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
		<div className=' flex min-h-screen flex-col items-center  justify-center pb-20 pt-24 text-slate-800'>
			{useConffeti()}
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
				Thanks for helping chesspecker grow!
			</h1>
			<div className='my-3 mx-0 w-full text-center text-white'>
				<Button href='/dashboard'>LET&apos;S GO! 🔥</Button>
			</div>
		</div>
	);
};

SuccessPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SuccessPage;
