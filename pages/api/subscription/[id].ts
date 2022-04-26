import process from 'process';
import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Stripe from 'stripe';
import {withSessionRoute} from '@/lib/session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27',
});

export type Data =
	| {
			success: true;
			subscription: Stripe.Subscription;
	  }
	| {
			success: false;
			error: string;
	  };

// Retrieve
const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	// TODO:	donst customer = await stripe.customers.retrieve(id);
	const {id} = request.query as {id: string};
	const {data} = await stripe.subscriptions.list({customer: id});
	response.status(200).json({success: true, subscription: data[0]});
};

// Update
const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const subscription = await stripe.subscriptions.update(request.body.id, {
		items: request.body.priceId as Stripe.SubscriptionUpdateParams.Item[],
	});
	response.status(200).json({success: true, subscription});
};

// Cancel subscription
const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query as {id: string};
	const subscription = await stripe.subscriptions.update(id, {
		cancel_at_period_end: true,
	});
	response.status(200).json({success: true, subscription});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
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
