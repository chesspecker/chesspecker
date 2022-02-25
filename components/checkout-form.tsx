import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {Modal} from 'antd';
import {useState, useRef} from 'react';
import {Button} from './button';

const CheckoutForm = () => {
	const stripe = useStripe();
	const cart = useRef(null);
	const elements = useElements();
	const [name, setName] = useState('');

	const handleSubscription = subscription => {
		const {latest_invoice} = subscription;
		const {payment_intent} = latest_invoice;

		if (payment_intent) {
			const {client_secret, status} = payment_intent;

			if (status === 'requires_action') {
				stripe.confirmCardPayment(client_secret).then(function (result) {
					if (result.error) {
						// The card was declined (i.e. insufficient funds, card has expired, etc)
						Modal.error({
							title: 'Error',
							content: result.error.message,
						});
					} else {
						// Success!
						Modal.success({
							title: 'Success',
						});
					}
				});
			} else {
				// No additional information was needed
				Modal.success({
					title: 'Success',
				});
			}
		} else {
			console.log(`handleSubscription:: No payment information received!`);
		}
	};

	const handleStripePaymentMethod = async result => {
		if (result.error) {
			Modal.error({
				title: 'Error',
				content: result.error.message,
			});
		} else {
			const response = await fetch('api/stripe/create-customer', {
				method: 'POST',
				mode: 'same-origin',
				body: JSON.stringify({
					paymentMethodId: result.paymentMethod.id,
				}),
			});

			console.log('response', response);

			const subscription = await response.json();
			console.log('suscription in fucntion', subscription);
			handleSubscription(subscription);
		}
	};

	const validateFields = async () => {
		const result = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
			billing_details: {
				address: {
					city: null,
					line1: null,
					postal_code: null,
					state: null,
				},
				email: null,
				name: name,
				phone: null,
			},
		});
		await handleStripePaymentMethod(result);
	};

	const handleSubmit = async () => {
		console.log('bonsoire');
		validateFields();
	};

	const cardOptions = {
		iconStyle: 'solid',
		style: {
			base: {
				iconColor: '#1890ff',
				color: 'rgba(0, 0, 0, 0.65)',
				fontWeight: 500,
				fontFamily: 'Segoe UI, Roboto, Open Sans, , sans-serif',
				fontSize: '25px',
				fontSmoothing: 'antialiased',
				':-webkit-autofill': {color: '#fce883'},
				'::placeholder': {color: '#bfbfbf'},
			},
			invalid: {
				iconColor: '#ffc7ee',
				color: '#ffc7ee',
			},
		},
	};

	const handleNameChange = e => {
		setName(e.target.value);
	};

	return (
		<body className='flex min-h-screen w-screen flex-col items-center justify-center  p-8 text-gray-800'>
			<h1 className='mb-10 text-4xl text-white'>
				Become a Chesspecker Sponsor 🎉
			</h1>
			<div className='grid w-full max-w-screen-lg gap-8 md:grid-cols-2 lg:grid-cols-3'>
				<div className='lg:col-span-2'>
					<div className=' min-h-full rounded bg-white shadow-lg'>
						<p className='font-xl m-2 text-xl'>Name</p>
						<input
							className='border-grey-200 w-fitt m-2 border p-3'
							value={name}
							onChange={handleNameChange}
						/>
						<p className='font-xl m-2 text-xl'>Card Number</p>
						<div className='border-grey-200 m-2 border p-3'>
							<CardElement options={cardOptions} ref={cart} />
						</div>
					</div>
				</div>
				<div>
					<div className='rounded bg-white py-6 shadow-lg'>
						<div className='px-8'>
							<div className='flex items-end'>
								<span className='ml-auto text-xl font-semibold'>$3</span>
								<span className='mb-px text-xl text-gray-500'>/mo</span>
							</div>
						</div>
						<div className='mt-4 px-8'></div>
						<div className='mt-4 border-t px-8 pt-4'>
							<div className='flex items-end justify-between'>
								<span className='font-semibold'>Today you pay (EUR)</span>
								<span className='font-semibold'>$3</span>
							</div>
							<span className='mt-2 text-xs text-gray-500'>
								Every month you will be charged of 3 euros.
							</span>
						</div>

						<div className='flex flex-col px-8 pt-4'>
							<Button onClick={handleSubmit}> Start Subscription</Button>
						</div>
					</div>
				</div>
			</div>
		</body>
	);
};
export default CheckoutForm;
