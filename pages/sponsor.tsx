import Stripe from 'stripe';
import type {ReactElement} from 'react';
import {useEffect, useState} from 'react';
import Modal from 'react-pure-modal';
import {useRouter} from 'next/router';
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
			<Button className='mx-2' onClick={toggle}>
				cancel 😥
			</Button>

			<Modal header='Delete' isOpen={isOpen} onClose={hide}>
				<div className='flex flex-col items-center text-sm'>
					<p className='pb-3'>Are you shure to cancel subscription</p>
					<iframe
						allowFullScreen
						src='https://giphy.com/embed/CT5Ye7uVJLFtu'
						width='480'
						height='163'
						frameBorder='0'
						className='giphy-embed'
					/>

					<div className='m-2 p-2'>
						<Button onClick={onClick}>Yes</Button>

						<Button onClick={hide}>No</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

const BecomeSponsor = ({
	handleClick,
}: {
	handleClick: (string: string) => void;
}) => {
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
				allowFullScreen
				src='https://giphy.com/embed/lCbSAbRrFEfkY'
				width='480'
				height='372'
				frameBorder='0'
				className='giphy-embed'
			/>
			<p className='mb-6 mt-7 w-11/12 text-center text-2xl text-gray-100 md:text-2xl'>
				How much does it cost? Just one small coffee per month !
			</p>
			<p>
				<a href='https://giphy.com/gifs/lCbSAbRrFEfkY'>via GIPHY</a>
			</p>
			<div className='flex w-2/3'>
				<Button
					className='mx-2'
					onClick={() => {
						handleClick('price_1KrH3UGL9hdiIkIS71GBjPNS');
					}}
				>
					1 Coffee ☕️ (3€)
				</Button>
				<Button
					className='mx-2'
					onClick={() => {
						handleClick('price_1KrH9zGL9hdiIkISPg2FKEBD');
					}}
				>
					2 Coffee (5€) ☕️☕️
				</Button>
				<Button
					className='mx-2'
					onClick={() => {
						handleClick('price_1KrH5yGL9hdiIkIShHkBKgPN');
					}}
				>
					Lots of coffee (15€)
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
		<div className='mx-10 flex min-h-screen flex-col items-center justify-center pt-32 pb-24 text-slate-800'>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
				Manage sponsorship
			</h1>
			<p className='mb-6 w-11/12 text-center text-2xl text-gray-100 md:text-2xl'>
				Thank you for supporting us.
			</p>
			<p className='pb-6 text-white'>{`Your actual subscription is ${
				((subscription as any)?.plan.amount as number) / 100
			} € per month`}</p>

			<RemoveModal onClick={async () => cancelSubscription()} />
		</div>
	);
};

const SponsorPage = () => {
	const data = useUser();
	const [user, setUser] = useState<UserInterface>();
	const [subscription, setSubscription] = useState<Stripe.Subscription>();

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
		if (user?.isSponsor) {
			// TODO: Retrive contract
		}
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
			const stripe = await getStripe();
			const {error} = await stripe.redirectToCheckout({sessionId});
			if (error) console.log(error);
		}
	};

	if (user?.isSponsor && !subscription?.cancel_at_period_end)
		return <ManageSponsor subscription={subscription} />;

	return <BecomeSponsor handleClick={handleClick} />;
};

SponsorPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SponsorPage;
