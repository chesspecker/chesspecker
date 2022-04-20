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
		<div className='mx-10 flex h-screen flex-col items-center justify-center text-slate-800'>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
				Become sponsor
			</h1>
			<p className='mb-6 w-11/12 text-center text-2xl text-gray-100 md:text-2xl'>
				We love to code on this site. Become a sponsor to help us pay for the
				server costs and to have the chance to unlock a great (really nice)
				badge !
			</p>
			<iframe
				src='https://giphy.com/embed/lCbSAbRrFEfkY'
				width='480'
				height='372'
				frameBorder='0'
				class='giphy-embed'
				allowFullScreen
			></iframe>
			<p className='mb-6 mt-7 w-11/12 text-center text-2xl text-gray-100 md:text-2xl'>
				How much does it cost? Just one small coffee per month !
			</p>
			<p>
				<a href='https://giphy.com/gifs/lCbSAbRrFEfkY'>via GIPHY</a>
			</p>
			<div className='w-1/3'>
				<Button onClick={handleClick}>LET&apos;S GO! 🔥</Button>
			</div>
		</div>
	);
};

SponsorPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SponsorPage;
