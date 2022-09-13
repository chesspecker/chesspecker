import Stripe from 'stripe';
import type {ReactElement} from 'react';
import {useState} from 'react';
import Modal from 'react-pure-modal';
import {useRouter} from 'next/router';
import {NextSeo} from 'next-seo';
import type {
	CheckoutRequestBody,
	CheckoutData,
} from '@/pages/api/subscription/index';
import useModal from '@/hooks/use-modal';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import getStripe from '@/lib/get-stripe';
import {User} from '@/models/user';
import useEffectAsync from '@/hooks/use-effect-async';
import {getUser, get_} from '@/lib/api-helpers';

const STRIPE_PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

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
						sandbox='allow-scripts'
						src='https://giphy.com/embed/CT5Ye7uVJLFtu'
						width='480'
						height='163'
						frameBorder='0'
						className='giphy-embed'
					/>

					<div className='p-2 m-2'>
						<Button className='px-8 my-2' onClick={onClick}>
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
		<>
			<NextSeo title='👑 Sponsor' />
			<div className='flex flex-col items-center justify-center min-h-screen pt-12 md:pt-24 pb-40'>
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center'>
					Become sponsor
				</h1>
				<p className='w-11/12 mb-6 text-2xl text-center md:text-2xl max-w-md lg:max-w-3xl'>
					⚠️ Since last year more than 22k people used our website. However we
					cannot maintain the website: our monthly server fees are now above 60
					euros. For many this is not huge, but for two students, it is. We have
					never used ads on the site and never will. Today we are asking for
					your help. If we don't have enough subscriptions to cover these costs
					we will be forced to put an end to this project at the end of the
					month...
				</p>
				<iframe
					allowFullScreen
					sandbox='allow-scripts'
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
							handleClick('price_1L5Q2vGL9hdiIkISCVM9RbKS');
						}}
					>
						☕️ 1€
					</Button>
					<Button
						className='m-2'
						onClick={() => {
							handleClick('price_1KxCYVGL9hdiIkISDFBzzU6Z');
						}}
					>
						☕️☕️ 3€
					</Button>
					<Button
						className='m-2'
						onClick={() => {
							handleClick('price_1KxCa8GL9hdiIkISXvkAuA4F');
						}}
					>
						☕️☕️☕️ 5€
					</Button>
					<Button
						className='m-2'
						onClick={() => {
							handleClick('price_1KxCafGL9hdiIkISewaLCtNO');
						}}
					>
						🛢 15€
					</Button>
				</div>
			</div>
		</>
	);
};

type ManageSponsorProps = {subscription?: Stripe.Subscription};
const ManageSponsor = ({subscription}: ManageSponsorProps) => {
	const router = useRouter();
	const cancelSubscription = async () => {
		if (!subscription?.id) return;
		await fetch(`/api/subscription/${subscription.id}`, {method: 'DELETE'});
		router.reload();
	};

	return (
		<>
			<NextSeo title='👑 Sponsor' />
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
	const [user, setUser] = useState<User>();
	const [subscription, setSubscription] = useState<Stripe.Subscription>();

	useEffectAsync(async () => {
		const response = await getUser();
		if (!response.success) return;
		const user = response.data;
		setUser(() => user);

		if (!user?.isSponsor || !user?.stripeId) return;
		const sub = await get_.subscription(user.stripeId);
		if (sub.success) setSubscription(() => sub.data);
	}, []);

	const handleClick = async (priceId: string) => {
		const body: CheckoutRequestBody = {stripePriceId: priceId};
		if (user?.stripeId) body.customer = user.stripeId;

		const result = await fetch('/api/subscription', {
			method: 'POST',
			body: JSON.stringify(body),
		}).then(async response => response.json() as Promise<CheckoutData>);

		if (result.success) {
			const {id: sessionId} = result.data;
			const stripe = await getStripe(STRIPE_PUBLISHABLE);
			if (!stripe) return;
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
