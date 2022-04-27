import {ReactElement, useState, useEffect} from 'react';
import Stripe from 'stripe';
import {useRouter} from 'next/router';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import useUser from '@/hooks/use-user';
import type {UserInterface} from '@/types/models';

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
		<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
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
