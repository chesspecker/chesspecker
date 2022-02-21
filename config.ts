import {env} from 'process';

export const db = {
	url: env.DB_URL,
	name: env.DB_NAME,
	debug: env.DB_DEBUG,
};

export const redisConfig = {
	uri: env.REDIS_URI,
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

export const siteUrl =
	env.NODE_ENV === 'production'
		? `https://api.chesspecker.com`
		: `http://localhost:3000/api`;

export const siteRedirectUrl =
	env.NODE_ENV === 'production'
		? 'https://www.chesspecker.com'
		: `http://localhost:3000`;

export const SECRET_COOKIE_PASSWORD = env.SECRET_COOKIE_PASSWORD;
