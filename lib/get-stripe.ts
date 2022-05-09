import {Stripe, loadStripe} from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = async (key:string) => {
	if (await stripePromise) return stripePromise;
	stripePromise = loadStripe(key);
	return stripePromise;
};

export default getStripe;
