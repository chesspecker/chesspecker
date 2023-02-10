import type {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/utils';
import type {SuccessData, ErrorData} from '@/types/data';

const STRIPE_PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripe = new Stripe(STRIPE_PUBLISHABLE, {apiVersion: '2020-08-27'});

export type SubscriptionData = SuccessData<Stripe.Subscription> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as {[key: string]: string};
	if (!id) {
		fail('Missing id', 400);
		return;
	}

	const {data} = await stripe.subscriptions.list({customer: id});
	if (!data[0]) {
		fail('Subscription not found', 404);
		return;
	}

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
	const fail = failWrapper(response);
	const {id, priceId: items} = request.body as PutRequestBody;
	if (!id || items) {
		fail('Body missing params', 400);
		return;
	}

	const data = await stripe.subscriptions.update(id, {items});
	if (!data) {
		fail('Subscription not found', 404);
		return;
	}

	response.status(200).json({success: true, data});
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as {[key: string]: string};
	if (!id) {
		fail('Missing id', 400);
		return;
	}

	const data = await stripe.subscriptions.update(id, {
		cancel_at_period_end: true,
	});
	if (!data) {
		fail('Subscription not found', 404);
		return;
	}

	response.status(200).json({success: true, data});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<SubscriptionData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'GET': {
			await get_(request, response);
			return;
		}

		case 'PUT': {
			await put_(request, response);
			return;
		}

		case 'DELETE': {
			await delete_(request, response);
			return;
		}

		default: {
			response.status(405).json({success: false, error: 'Method not allowed'});
		}
	}
};

export default withMongoRoute(withSessionRoute(handler));
