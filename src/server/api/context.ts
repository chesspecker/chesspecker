import {type inferAsyncReturnType} from '@trpc/server';
import {type CreateNextContextOptions} from '@trpc/server/adapters/next';
import {getIronSession} from 'iron-session';
import {prisma} from '../db';
import {sessionOptions} from '@/lib/session';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
	const session = await getIronSession(opts.req, opts.res, sessionOptions);

	return {
		session,
		prisma,
	};
};

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
