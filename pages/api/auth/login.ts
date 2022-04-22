import {createHash, randomBytes} from 'crypto';
import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {lichess, origin} from '@/config';
import {withSessionRoute} from '@/lib/session';

// eslint-disable-next-line node/prefer-global/buffer
const base64URLEncode = (buffer_: Buffer): string =>
	buffer_
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');

// eslint-disable-next-line node/prefer-global/buffer
const sha256 = (string_: string): Buffer =>
	createHash('sha256').update(string_).digest();
const createVerifier = (): string => base64URLEncode(randomBytes(32));
const createChallenge = (verifier: string) => base64URLEncode(sha256(verifier));

const loginRoute = async (
	request: NextApiRequest,
	response: NextApiResponse,
) => {
	if (request.method !== 'GET') {
		response.status(405).json({success: false, message: 'Method not allowed.'});
		return;
	}

	if (request.session.userID) {
		response.redirect(303, `${origin}/success-login`);
		return;
	}

	const verifier = createVerifier();
	const challenge = createChallenge(verifier);
	request.session.verifier = verifier;
	await request.session.save();

	const linkParameters = new URLSearchParams({
		response_type: 'code',
		client_id: lichess.clientId,
		redirect_uri: `${origin}/api/auth/callback`,
		scope: 'preference:read',
		code_challenge_method: 'S256',
		code_challenge: challenge,
	});
	response.redirect(
		302,
		`https://lichess.org/oauth?${linkParameters.toString()}`,
	);
};

export default withMongoRoute(withSessionRoute(loginRoute));
