import process from 'process';
import type {IronSessionOptions} from 'iron-session';
import type {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiHandler,
} from 'next/types';
import {withIronSessionApiRoute, withIronSessionSsr} from 'iron-session/next';
import type {User} from '@prisma/client';
import {env} from '@/env.mjs';

declare module 'iron-session' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface IronSessionData {
		verifier?: string;
		lichessToken?: string;
		user: User;
		userId?: string;
		username?: string;
		state?: string;
	}
}

export const sessionOptions: IronSessionOptions = {
	password: env.COOKIE_PASSWORD,
	cookieName: 'chesspecker',
	cookieOptions: {
		// eslint-disable-next-line no-process-env
		secure: process.env.NODE_ENV === 'production',
		maxAge: undefined,
	},
};

export const withSessionRoute = (handler: NextApiHandler) =>
	withIronSessionApiRoute(handler, sessionOptions);

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export const withSessionSsr = <P extends {[key: string]: unknown}>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) => withIronSessionSsr(handler, sessionOptions);
