import process from 'process';
import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import {buffer} from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27',
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

type SuccessData = {
	received: true;
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
	const buf = await buffer(request);
	let event = JSON.parse(buf.toString());

	if (webhookSecret) {
		// Get the signature sent by Stripe
		const sig = request.headers['stripe-signature'];
		try {
			event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
		} catch (error) {
			console.log(`⚠️  Webhook signature verification failed.`, error.message);
			response
				.status(400)
				.send({success: false, error: `Webhook Error: ${error.message}`});
			return;
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

	response.json({received: true});
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
