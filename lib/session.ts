import process from 'process';
import type {IronSessionOptions} from 'iron-session';
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiHandler,
} from 'next/types';
import {withIronSessionApiRoute, withIronSessionSsr} from 'iron-session/next';
import {cookiePassword} from '@/config';

declare type User = Record<string, unknown>;

declare module 'iron-session' {
	interface IronSessionData {
		user?: User;
		verifier?: string;
		token?: string;
		userID?: string;
		username?: string;
	}
}

export const sessionOptions: IronSessionOptions = {
	password: cookiePassword,
	cookieName: 'chesspecker',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: undefined,
	},
};

export const withSessionRoute = (handler: NextApiHandler) =>
	withIronSessionApiRoute(handler, sessionOptions);

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
	P extends Record<string, unknown> = Record<string, unknown>,
>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
	return withIronSessionSsr(handler, sessionOptions);
}
