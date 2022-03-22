import Stripe from 'stripe';
import type {ReactElement} from 'react';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';

import getStripe from '@/lib/get-stripe';

const SponsorPage = () => {
	const handleClick = async () => {
		const response = await fetch('/api/checkout-sessions', {
			method: 'POST',
			body: JSON.stringify({}),
		});

		if (response.ok) {
			const data = (await response.json()) as Stripe.Checkout.Session;
			const {id: sessionId} = data;
			const stripe = await getStripe();
			const {error} = await stripe.redirectToCheckout({sessionId});
			if (error) console.log(error);
		}
	};

	return (
		<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
				Become sponsor
			</h1>
			<p className='w-11/12 text-2xl text-gray-100 md:text-3xl'>
				Why you should help us blabla
			</p>
			<Button onClick={handleClick}>LET&apos;S GO! 🔥</Button>
		</div>
	);
};

SponsorPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SponsorPage;
