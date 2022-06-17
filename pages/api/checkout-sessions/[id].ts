import process from 'process';
import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Stripe from 'stripe';
import {withSessionRoute} from '@/lib/session';

const key = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(key, {
	apiVersion: '2020-08-27',
});

const getStripeSession = async (
	request: NextApiRequest,
	response: NextApiResponse<Stripe.Checkout.Session>,
) => {
	const {id} = request.query as Record<string, string>;
	const session = await stripe.checkout.sessions.retrieve(id);
	if (!session) {
		response.status(404).end('Session Not Found');
		return;
	}

	response.status(200).json(session);
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'GET':
			return getStripeSession(request, response);
		default:
			response.status(405).end(`Method Not Allowed`);
	}
};

export default withMongoRoute(withSessionRoute(handler));
