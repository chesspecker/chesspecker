import {Stripe, loadStripe} from '@stripe/stripe-js';

// eslint-disable-next-line @typescript-eslint/ban-types
let stripePromise: Promise<Stripe | null>;
const getStripe = async (key: string) => {
	if (await stripePromise) return stripePromise;
	stripePromise = loadStripe(key);
	return stripePromise;
};

export default getStripe;
