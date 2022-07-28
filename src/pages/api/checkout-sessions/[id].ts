import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/utils';
import {ErrorData, SuccessData} from '@/types/data';

const STRIPE_PUBLISHABLE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripe = new Stripe(STRIPE_PUBLISHABLE, {apiVersion: '2020-08-27'});

export type SessionData = SuccessData<Stripe.Checkout.Session> | ErrorData;

const getStripeSession = async (
	request: NextApiRequest,
	response: NextApiResponse<SessionData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing id', 400);
		return;
	}

	const session = await stripe.checkout.sessions.retrieve(id);
	if (!session) {
		fail('Session Not Found', 404);
		return;
	}

	response.status(200).json({success: true, data: session});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<SessionData>,
) => {
	switch (request.method) {
		case 'GET':
			return getStripeSession(request, response);
		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
