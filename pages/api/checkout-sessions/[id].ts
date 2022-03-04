import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import User, {UserInterface} from '@/models/user-model';
import {withSessionRoute} from '@/lib/session';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getStripeSession = async (
	request: NextApiRequest,
	response: NextApiResponse,
) => {
	const {id} = request.query;
	const {userID} = request.session;
	const session = await stripe.checkout.sessions.retrieve(id);
	if (!session) {
		response.status(404).end('Session Not Found');
		return;
	}

	const result = await User.findByIdAndUpdate(userID, {isSponsor: true}).exec();
	response.status(200).json(session);
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'GET':
			return getStripeSession(request, response);
		default:
			response.status(405).end(`Method ${request.method} Not Allowed`);
	}
};

export default withMongoRoute(withSessionRoute(handler));
