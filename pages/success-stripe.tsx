import {ReactElement, useState} from 'react';
import Stripe from 'stripe';
import {useRouter} from 'next/router';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import {fetcher} from '@/lib/fetcher';
import useUser from '@/hooks/use-user';
import type {Data as UserData} from '@/api/user/[id]';

const SuccessPage = () => {
	const router = useRouter();
	const {user} = useUser();
	const {session_id: sessionId} = router.query;
	const [, setSession] = useState<Stripe.Checkout.Session>();

	const updateUser = {
		$set: {
			isSponsor: true,
		},
	};

	useEffectAsync(async () => {
		if (!sessionId) return;
		const response = await fetch(
			`/api/checkout-sessions/${sessionId as string}`,
		);
		const data = (await response.json()) as Stripe.Checkout.Session;
		setSession(data);
		const userResult = (await fetcher.put(
			`/api/user/${user._id.toString()}`,
			updateUser,
		)) as UserData;
	}, [sessionId]);

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
