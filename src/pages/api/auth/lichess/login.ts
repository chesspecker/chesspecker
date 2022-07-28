import {createHash, randomBytes} from 'crypto';
import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/utils';
import {LICHESS_CONFIG, ORIGIN} from '@/config';
import type {ErrorData} from '@/types/data';

// eslint-disable-next-line n/prefer-global/buffer
const base64URLEncode = (buffer_: Buffer): string =>
	buffer_
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');

// eslint-disable-next-line n/prefer-global/buffer
const sha256 = (string_: string): Buffer =>
	createHash('sha256').update(string_).digest();
const createVerifier = (): string => base64URLEncode(randomBytes(32));
const createChallenge = (verifier: string) => base64URLEncode(sha256(verifier));

const loginRoute = async (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
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

	try {
		await request.session.save();
	} catch (error: unknown) {
		fail((error as Error).message);
	}

	const linkParameters = new URLSearchParams({
		response_type: 'code',
		client_id: LICHESS_CONFIG.clientId,
		redirect_uri: `${ORIGIN}/api/auth/lichess/callback`,
		scope: 'preference:read',
		code_challenge_method: 'S256',
		code_challenge: challenge,
	}).toString();

	response.redirect(302, `https://lichess.org/oauth?${linkParameters}`);
};

export default withMongoRoute(withSessionRoute(loginRoute));
