import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import withMongoRoute from '@/providers/mongoose';
import getChesscom from '@/lib/get-chesscom';
import User from '@/models/user';
import {createChesscomUser} from '@/controllers/create-user';
import {failWrapper} from '@/lib/utils';
import {ORIGIN} from '@/config';

type ErrorData = {
	success: false;
	error: string;
};

const callback = async (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	const fail = failWrapper(response);
	if (request.method !== 'GET') {
		fail('Method not allowed', 405);
		return;
	}

	if (request.query.state !== request.session.state) {
		fail('Invalid state');
		return;
	}

	try {
		const {verifier} = request.session;
		if (!verifier) throw new Error('No verifier');
		if (!request.query.code) throw new Error('No code');
		const chesscomToken = await getChesscom.token(request.query.code, verifier);
		const oauthToken = chesscomToken.access_token;

		const chesscomUser = await getChesscom.account(oauthToken, '');
		if (!chesscomUser) throw new Error('user login failed');

		let user = await User.findOne({id: chesscomUser.username}).lean().exec();
		if (!user) user = await createChesscomUser(chesscomUser);
		request.session.type = 'chesscom';
		request.session.chesscomToken = oauthToken;
		request.session.userID = user._id.toString();
		request.session.username = user.username;
		await request.session.save();
		response.redirect(302, `${ORIGIN}/success-login`);
		return;
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

export default withMongoRoute(withSessionRoute(callback));
