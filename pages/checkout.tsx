import {loadStripe} from '@stripe/stripe-js';
import type {ReactElement} from 'react';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/checkout-form';
import Layout from '@/layouts/main';

const CheckoutPage = () => {
	const stripePromise = loadStripe(
		'pk_test_51KX5ycJJnC3eZxpZf8JcmVJqsHTCSfUzGla9YALmeF4BUmP5ztObBD24ZUaU25qFqffHePIvI1EZGgmM9iLYKAPd00kn3mi08p',
	);
	return (
		<>
			<Elements stripe={stripePromise}>
				<CheckoutForm />
			</Elements>
		</>
	);
};
CheckoutPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default CheckoutPage;
