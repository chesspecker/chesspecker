import process from 'process';
import Stripe from 'stripe';
import type {ReactElement} from 'react';
import {useEffect, useState} from 'react';
import Modal from 'react-pure-modal';
import {useRouter} from 'next/router';
import {NextSeo} from 'next-seo';
import type {Data as SubscriptionData} from '@/api/subscription/[id]';
import type {SubBody, Data as SessionData} from '@/api/subscription/index';
import useModal from '@/hooks/use-modal';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import useUser from '@/hooks/use-user';
import getStripe from '@/lib/get-stripe';
import type {UserInterface} from '@/types/models';
import useEffectAsync from '@/hooks/use-effect-async';

type Props = {onClick: () => Promise<void>};
const RemoveModal = ({onClick}: Props) => {
	const {isOpen, hide, toggle} = useModal(false);
	return (
		<>
			<Button className='max-w-lg mx-2' onClick={toggle}>
				cancel 😥
			</Button>

			<Modal header='Delete' isOpen={isOpen} onClose={hide}>
				<div className='flex flex-col items-center text-sm'>
					<p className='pb-3'>
						Are you sure you want to cancel your subscription?
					</p>
					<iframe
						allowFullScreen
						src='https://giphy.com/embed/CT5Ye7uVJLFtu'
						width='480'
						height='163'
						frameBorder='0'
						className='giphy-embed'
					/>

					<div className='p-2 m-2'>
						<Button className='px-8 my-2 ' onClick={onClick}>
							Yes
						</Button>
						<Button onClick={hide}>No</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

type PageProps = {handleClick: (string: string) => void};
const BecomeSponsor = ({handleClick}: PageProps) => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen pt-24 pb-40 '>
			<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
				Become sponsor
			</h1>
			<p className='w-11/12 mb-6 text-2xl text-center md:text-2xl'>
				This website is free and ads-less and we are having fun coding it.
				<br />
				However, it still has a cost. Become a sponsor today to help us paying
				server costs.
				<br /> It will also unlock a great badge! 🎉
			</p>
			<iframe
				allowFullScreen
				src='https://giphy.com/embed/lCbSAbRrFEfkY'
				width='480'
				height='372'
				frameBorder='0'
				className='giphy-embed'
			/>
			<p className='w-11/12 mb-6 text-2xl text-center mt-7 md:text-2xl'>
				How much does it cost? Just about a small coffee per month!
			</p>

			<div className='flex flex-col w-2/3 lg:flex-row'>
				<Button
					className='m-2'
					onClick={() => {
						handleClick('price_1KxCYVGL9hdiIkISDFBzzU6Z');
					}}
				>
					☕️ 3€
				</Button>
				<Button
					className='m-2'
					onClick={() => {
						handleClick('price_1KxCa8GL9hdiIkISXvkAuA4F');
					}}
				>
					☕️☕️ 5€
				</Button>
				<Button
					className='m-2'
					onClick={() => {
						handleClick('price_1KxCafGL9hdiIkISewaLCtNO');
					}}
				>
					☕️☕️☕️ 15€
				</Button>
			</div>
		</div>
	);
};

const ManageSponsor = ({subscription}: {subscription: Stripe.Subscription}) => {
	const router = useRouter();
	const cancelSubscription = async () => {
		await fetch(`/api/subscription/${subscription.id}`, {method: 'DELETE'});
		router.reload();
	};

	return (
		<>
			<NextSeo
				title='ChessPecker | Sponsor'
				description='Become a sponsor to help us make chessPecker grow !'
			/>
			<div className='flex flex-col items-center justify-center min-h-screen pt-24 pb-20 '>
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
					Manage sponsorship
				</h1>
				<p className='w-11/12 mb-6 text-2xl text-center md:text-2xl'>
					Thank you for supporting us.
				</p>
				<p className='pb-6 '>{`Your actual subscription is ${
					((subscription as any)?.plan.amount as number) / 100
				} € per month`}</p>

				<RemoveModal onClick={async () => cancelSubscription()} />
			</div>
		</>
	);
};

const SponsorPage = () => {
	const data = useUser();
	const [user, setUser] = useState<UserInterface>();
	const [subscription, setSubscription] = useState<Stripe.Subscription>();

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);

	useEffectAsync(async () => {
		if (!user?.isSponsor) return;
		const data = await fetch(`/api/subscription/${user.stripeId}`).then(
			async response => response.json() as Promise<SubscriptionData>,
		);
		if (!data.success) return;
		setSubscription(data.subscription);
	}, [user]);

	const handleClick = async (priceId: string) => {
		const body: SubBody = {stripePriceId: priceId};
		if (user.stripeId) body.customer = user.stripeId;

		const data = await fetch('/api/subscription', {
			method: 'POST',
			body: JSON.stringify(body),
		}).then(async response => response.json() as Promise<SessionData>);

		if (data.success) {
			const {id: sessionId} = data.session;
			const stripe = await getStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
			);
			const {error} = await stripe.redirectToCheckout({sessionId});
			if (error) console.error(error);
		}
	};

	if (user?.isSponsor && !subscription?.cancel_at_period_end)
		return <ManageSponsor subscription={subscription} />;

	return <BecomeSponsor handleClick={handleClick} />;
};

SponsorPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SponsorPage;
