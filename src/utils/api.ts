/* eslint-disable no-process-env */
import {httpBatchLink, loggerLink} from '@trpc/client';
import {createTRPCNext} from '@trpc/next';
import {type inferRouterInputs, type inferRouterOutputs} from '@trpc/server';
import superjson from 'superjson';
import {type AppRouter} from '../server/api/root';

const getBaseUrl = () => {
	if (typeof window !== 'undefined') return '';
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const api = createTRPCNext<AppRouter>({
	config({ctx}) {
		return {
			transformer: superjson,
			links: [
				loggerLink({
					enabled: opts =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						if (ctx?.req) {
							const {connection: _connection, ...headers} = ctx.req.headers;
							return {
								...headers,
							};
						}

						return {};
					},
				}),
			],
			/*
			 * queryClientConfig: {
			 * 	defaultOptions: {
			 * 		queries: {
			 * 			retry: 1,
			 * 		},
			 * 	},
			 * },
			 */
		};
	},
	ssr: true,
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
