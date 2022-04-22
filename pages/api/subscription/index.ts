import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Stripe from 'stripe';
import {Data} from '../user';
import {DataMany} from '../achievement';
import {withSessionRoute} from '@/lib/session';
import {origin} from '@/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27',
});

// Retrieve
const get_ = async (request, response) => {
	const {id} = request.query;
	const customer = await stripe.customers.retrieve(
		request.body.stripe_customer_id,
	);
	const subscriptions = customer.subscriptions.data[0];
	console.log('the subscription id', subscriptions.id);
	response.status(200).json(subscriptions);
};

// Update
const put_ = async (request, response) => {
	console.log('priceId', request.body.priceId);
	const sub = await stripe.subscriptions.update(request.body.id, {
		items: request.body.priceId,
	});
	response.status(200).json(sub);
};

// Create
const post_ = async (request, response) => {
	const {stripePriceId, customer} = JSON.parse(request.body);
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
		response.status(200).json(session);
		return;
	} catch (error: unknown) {
		console.log('error', error);
		response.status(500).end('Internal Server Error');
	}
};

// Cancel subscription
const delete_ = async (request, response) => {
	const {id} = request.body;
	const subscription = await stripe.subscriptions.update(id, {
		cancel_at_period_end: true,
	});
	response.status(200).json(subscription);
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data | DataMany>,
) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			return;
		case 'POST':
			await post_(request, response);
			return;
		case 'PUT':
			await put_(request, response);
			return;
		case 'DELETE':
			await delete_(request, response);
			return;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
	}
};

export default withMongoRoute(withSessionRoute(handler));
