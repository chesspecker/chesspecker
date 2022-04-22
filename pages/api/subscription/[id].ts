import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Stripe from 'stripe';
import {Data} from '../user';
import {DataMany} from '../achievement';
import {retrieve} from '@/controllers/user';
import {withSessionRoute} from '@/lib/session';
import User from '@/models/user-model';
import type {UserInterface} from '@/models/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27',
});

// Retrieve
const get_ = async (request, response) => {
	const {id} = request.query;

	//	Const customer = await stripe.customers.retrieve(id);
	//	console.log('customer', customer);
	const {data} = await stripe.subscriptions.list({customer: id});
	const stripeSub = data[0];

	response.status(200).json({success: true, stripeSub});
};

// Update
const put_ = async (request, response) => {
	const sub = await stripe.subscriptions.update(request.body.id, {
		items: request.body.priceId,
	});
	response.status(200).json({success: true, sub});
};

// Cancel subscription
const delete_ = async (request, response) => {
	const {id} = request.query;
	console.log('the request', request);
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
