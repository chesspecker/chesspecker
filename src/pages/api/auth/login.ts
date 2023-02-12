/* eslint-disable no-param-reassign */
import {createHash, randomBytes} from 'crypto';
import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import {env} from '@/env.mjs';
import type {ErrorData} from '@/types/data';
import {failWrapper} from '@/lib/fail-wrapper';

const base64URLEncode = (buffer_: Buffer): string =>
	buffer_
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		// eslint-disable-next-line no-div-regex
		.replace(/=/g, '');

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

	if (request.session.userId) {
		response.redirect(303, `${env.ORIGIN}/success-login`);
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
		client_id: env.LICHESS_CLIENT_ID,
		redirect_uri: `${env.ORIGIN}/api/auth/callback`,
		scope: 'preference:read puzzle:read',
		code_challenge_method: 'S256',
		code_challenge: challenge,
	}).toString();

	response.redirect(302, `https://lichess.org/oauth?${linkParameters}`);
};

export default withSessionRoute(loginRoute);
