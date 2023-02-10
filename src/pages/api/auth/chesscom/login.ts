import {createHash, randomBytes} from 'crypto';
import type {NextApiRequest, NextApiResponse} from 'next';
import {nanoid} from 'nanoid';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/utils';
import {CHESSCOM_CONFIG, ORIGIN} from '@/config';

const base64URLEncode = (buffer_: Buffer): string =>
	buffer_
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/[=]/g, '');

const sha256 = (string_: string): Buffer =>
	createHash('sha256').update(string_).digest();
const createVerifier = (): string => base64URLEncode(randomBytes(32));
const createChallenge = (verifier: string) => base64URLEncode(sha256(verifier));
const state = nanoid();

const loginRoute = async (
	request: NextApiRequest,
	response: NextApiResponse,
) => {
	const fail = failWrapper(response);
	if (request.method !== 'GET') {
		fail('Method not allowed', 405);
		return;
	}

	if (request.session.userID) {
		response.redirect(303, `${ORIGIN}/success-login`);
		return;
	}

	const verifier = createVerifier();
	const challenge = createChallenge(verifier);
	request.session.verifier = verifier;
	request.session.state = state;

	try {
		await request.session.save();
	} catch (error: unknown) {
		fail((error as Error).message);
		return;
	}

	const linkParameters = new URLSearchParams({
		response_type: 'code',
		client_id: CHESSCOM_CONFIG.clientId,
		redirect_uri: `${ORIGIN}/api/auth/chesscom/callback`,
		scope: 'openid profile',
		state,
		code_challenge_method: 'S256',
		code_challenge: challenge,
	}).toString();

	response.redirect(302, `https://oauth.chess.com/authorize?${linkParameters}`);
};

export default withMongoRoute(withSessionRoute(loginRoute));
