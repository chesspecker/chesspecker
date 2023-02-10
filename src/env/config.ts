import {env} from 'process';

export const DATABASE_URL = env.DB_URL!;

export const STRIPE_PUBLISHABLE = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
export const STRIPE_SECRET = env.STRIPE_SECRET_KEY!;

export const COOKIE_PASSWORD = env.SECRET_COOKIE_PASSWORD!;

export const LICHESS_CONFIG = {
	clientId: env.LICHESS_CLIENT_ID!,
	clientSecret: env.LICHESS_CLIENT_SECRET!,
	token: env.LICHESS_TOKEN!,
};

export const CHESSCOM_CONFIG = {
	clientId: env.CHESSCOM_CLIENT_ID!,
};

export const ORIGIN =
	env.NODE_ENV === 'production'
		? 'https://www.chesspecker.com'
		: 'http://localhost:3000';
