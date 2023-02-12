/* eslint-disable @typescript-eslint/ban-ts-comment */
import {z} from 'zod';

const server = z.object({
	LICHESS_CLIENT_ID: z.string(),
	ORIGIN: z.string(),
	DATABASE_URL: z.string().url(),
	COOKIE_PASSWORD: z.string(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
});

const client = z.object({
	// NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});

/**
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
	LICHESS_CLIENT_ID: process.env.LICHESS_CLIENT_ID,
	DATABASE_URL: process.env.DATABASE_URL,
	COOKIE_PASSWORD: process.env.COOKIE_PASSWORD,
	NODE_ENV: process.env.NODE_ENV,
	ORIGIN:
		process.env.NODE_ENV === 'production'
			? 'https://www.chesspecker.com'
			: 'http://localhost:3000',
	// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);
/** @type z.infer<merged>
 *  @ts-ignore - can't type this properly in jsdoc */
let env = process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
	const isServer = typeof window === 'undefined';

	const parsed = isServer
		? merged.safeParse(processEnv) // on server we can validate all env vars
		: client.safeParse(processEnv); // on client we can only validate the ones that are exposed

	if (parsed.success === false) {
		console.error(
			'❌ Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
		);
		throw new Error('Invalid environment variables');
	}

	/** @type z.infer<merged>
	 *  @ts-ignore - can't type this properly in jsdoc */
	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== 'string') return undefined;
			// Throw a descriptive error if a server-side env var is accessed on the client
			// Otherwise it would just be returning `undefined` and be annoying to debug
			if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
				throw new Error(
					process.env.NODE_ENV === 'production'
						? '❌ Attempted to access a server-side environment variable on the client'
						: `❌ Attempted to access server-side environment variable '${prop}' on the client`,
				);
			/*  @ts-ignore - can't type this properly in jsdoc */
			return target[prop];
		},
	});
}

export {env};
