import process from 'process';
import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Stripe from 'stripe';
import {withSessionRoute} from '@/lib/session';
import {origin} from '@/config';
import {ErrorData, SuccessData} from '@/types/data';

const key = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(key, {apiVersion: '2020-08-27'});

export type CheckoutData = SuccessData<Stripe.Checkout.Session> | ErrorData;

export type CheckoutRequestBody = {
	stripePriceId: Stripe.Checkout.SessionCreateParams.LineItem['price'];
	customer?: Stripe.Checkout.SessionCreateParams['customer'];
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<CheckoutData>,
) => {
	const {stripePriceId, customer} = JSON.parse(
		request.body,
	) as CheckoutRequestBody;
	const parameters: Stripe.Checkout.SessionCreateParams = {
		line_items: [{price: stripePriceId, quantity: 1}],
		payment_method_types: ['card'],
		mode: 'subscription',
		success_url: `${origin}/success-stripe?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/cancel`,
	};

	if (customer) parameters.customer = customer;

	try {
		const session: Stripe.Checkout.Session =
			await stripe.checkout.sessions.create(parameters);
		response.status(200).json({success: true, data: session});
		return;
	} catch (error: unknown) {
		const error_ = error as Error;
		response.status(500).json({success: false, error: error_.message});
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<CheckoutData>,
) => {
	switch (request.method) {
		case 'POST':
			await post_(request, response);
			return;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
	}
};

export default withMongoRoute(withSessionRoute(handler));
