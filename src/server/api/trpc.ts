import {initTRPC} from '@trpc/server';
import superjson from 'superjson';
import type {TRPCContext} from './context';

const trpc = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
	errorFormatter({shape}) {
		return shape;
	},
});

export const createTRPCRouter = trpc.router;
export const publicProcedure = trpc.procedure;
