import {env} from 'process';

export const db = {
	url: env.DB_URL,
};

export const redisConfig = {
	uri: env.REDIS_URI,
};

export const stripeConfig = {
	publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	secretKey: env.STRIPE_SECRET_KEY,
};

export const lichess = {
	clientId: env.LICHESS_CLIENT_ID,
	clientSecret: env.LICHESS_CLIENT_SECRET,
	token: env.LICHESS_TOKEN,
};

export const config = {
	port: env.APP_PORT || 8000,
	frontPort: env.FRONT_PORT || 3000,
	status: env.NODE_ENV,
};

export const origin =
	env.NODE_ENV === 'production'
		? 'https://beta.chesspecker.com'
		: `http://localhost:3000`;

export const cookiePassword = env.SECRET_COOKIE_PASSWORD;
