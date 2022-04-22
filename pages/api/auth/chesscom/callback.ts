import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {origin} from '@/config';
import getChesscom from '@/lib/get-chesscom';

type ErrorData = {
	success: false;
	error: string;
};

const callback = async (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	if (request.method !== 'GET') {
		response.status(405).json({success: false, error: 'Method not allowed.'});
		return;
	}

	if (request.query.state !== request.session.state) {
		response.status(500).json({success: false, error: 'Invalid state.'});
		return;
	}

	try {
		const {verifier} = request.session;
		const chesscomToken = await getChesscom.token(request.query.code, verifier);
		const oauthToken = chesscomToken.access_token;
		console.log('token', oauthToken);
		response.redirect(302, `${origin}/success-login`);
		return;
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

export default withMongoRoute(withSessionRoute(callback));
