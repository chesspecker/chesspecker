import process from 'process';
import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Stripe from 'stripe';
import {withSessionRoute} from '@/lib/session';
import {SuccessData, ErrorData} from '@/types/data';

const key = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(key, {apiVersion: '2020-08-27'});

export type SubscriptionData = SuccessData<Stripe.Subscription> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
) => {
	const {id} = request.query as Record<string, string>;
	const {data} = await stripe.subscriptions.list({customer: id});
	response.status(200).json({success: true, data: data[0]});
};

type PutRequestBody = {
	id: string;
	priceId: Stripe.SubscriptionUpdateParams.Item[];
};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
) => {
	const {id, priceId} = request.body as PutRequestBody;
	const data = await stripe.subscriptions.update(id, {
		items: priceId,
	});
	response.status(200).json({success: true, data});
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
) => {
	const {id} = request.query as Record<string, string>;
	const data = await stripe.subscriptions.update(id, {
		cancel_at_period_end: true,
	});
	response.status(200).json({success: true, data});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
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
