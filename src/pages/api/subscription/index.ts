import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/utils';
import {ORIGIN} from '@/config';
import {ErrorData, SuccessData} from '@/types/data';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(STRIPE_SECRET, {apiVersion: '2020-08-27'});

export type CheckoutData = SuccessData<Stripe.Checkout.Session> | ErrorData;

export type CheckoutRequestBody = {
	stripePriceId: Stripe.Checkout.SessionCreateParams.LineItem['price'];
	customer?: Stripe.Checkout.SessionCreateParams['customer'];
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<CheckoutData>,
) => {
	const fail = failWrapper(response);
	const {stripePriceId, customer} = JSON.parse(
		request.body,
	) as CheckoutRequestBody;

	if (!stripePriceId) {
		fail('Missing price id', 400);
		return;
	}

	const parameters: Stripe.Checkout.SessionCreateParams = {
		line_items: [{price: stripePriceId, quantity: 1}],
		payment_method_types: ['card'],
		mode: 'subscription',
		success_url: `${ORIGIN}/success-stripe?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${ORIGIN}/cancel`,
	};

	if (customer) parameters.customer = customer;

	try {
		const session: Stripe.Checkout.Session =
			await stripe.checkout.sessions.create(parameters);
		response.status(200).json({success: true, data: session});
		return;
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<CheckoutData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'POST':
			await post_(request, response);
			return;

		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
