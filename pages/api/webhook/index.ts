import process from 'process';
import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import {PuzzleInterface} from '@/models/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27',
});

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret =
	'whsec_99fcd9515202763090aa50613b1e7fa1edaafe451a290ef8720f6a117b5ae23e';

type SuccessData = {
	success: true;
	puzzle: PuzzleInterface;
};

type ErrorData = {
	success: false;
	error: string;
};

type Data = SuccessData | ErrorData;

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	let event = request.body;

	console.log('the event', request.headers);
	if (endpointSecret) {
		// Get the signature sent by Stripe
		const signature = request.headers['stripe-signature'];
		try {
			event = stripe.webhooks.constructEvent(
				request.body,
				signature,
				endpointSecret,
			);
		} catch (error) {
			console.log(`⚠️  Webhook signature verification failed.`, error.message);
			return response.status(400);
		}
	}

	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
			// Then define and call a method to handle the successful payment intent.
			// handlePaymentIntentSucceeded(paymentIntent);
			break;
		case 'payment_method.attached':
			const paymentMethod = event.data.object;
			// Then define and call a method to handle the successful attachment of a PaymentMethod.
			// handlePaymentMethodAttached(paymentMethod);
			break;
		default:
			// Unexpected event type
			console.log(`Unhandled event type ${event.type}.`);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'POST':
			await post_(request, response);
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default handler;

// App.listen(4242, () => console.log('Running on port 4242'));
