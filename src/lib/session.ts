import process from 'process';
import type {IronSessionOptions} from 'iron-session';
import type {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiHandler,
} from 'next/types';
import {withIronSessionApiRoute, withIronSessionSsr} from 'iron-session/next';
import {COOKIE_PASSWORD} from '@/config';

declare module 'iron-session' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface IronSessionData {
		verifier?: string;
		lichessToken?: string;
		chesscomToken?: string;
		userID?: string;
		username?: string;
		type: 'lichess' | 'chesscom';
		state?: string;
	}
}

export const sessionOptions: IronSessionOptions = {
	password: COOKIE_PASSWORD,
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
	P extends {[key: string]: unknown} = {[key: string]: unknown},
>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
	return withIronSessionSsr(handler, sessionOptions);
}
