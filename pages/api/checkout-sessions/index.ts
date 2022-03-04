import Stripe from 'stripe';
import {NextApiRequest, NextApiResponse} from 'next';
import {origin} from '@/config';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createStripeSession = async (
	_request: NextApiRequest,
	response: NextApiResponse,
) => {
	const parameters: Stripe.Checkout.SessionCreateParams = {
		line_items: [{price: 'price_1KX6VVJJnC3eZxpZBQ3QZ76Q', quantity: 1}],
		payment_method_types: ['card'],
		mode: 'subscription',
		success_url: `${origin}/success-stripe?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/cancel`,
	};

	try {
		console.log('params', parameters);
		const session = await stripe.checkout.sessions.create(parameters);
		console.log('session', session);
		response.status(200).json(session);
		return;
	} catch (error) {
		console.log('error', error);
		response.status(500).end('Internal Server Error');
	}
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'POST':
			return createStripeSession(request, response);
		default:
			response.status(405).end(`Method ${request.method} Not Allowed`);
	}
};

export default handler;
