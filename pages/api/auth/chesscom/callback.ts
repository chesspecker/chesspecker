import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {origin} from '@/config';
import getChesscom from '@/lib/get-chesscom';
import User from '@/models/user-model';
import type {UserInterface} from '@/types/models';
import {createChesscomUser} from '@/controllers/user';

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

		const chesscomUser = await getChesscom.account(oauthToken);
		if (!chesscomUser) throw new Error('user login failed');

		let user: UserInterface = await User.findOne({id: chesscomUser.username});
		if (!user) user = await createChesscomUser(chesscomUser);
		request.session.type = 'chesscom';
		request.session.chesscomToken = oauthToken;
		request.session.userID = user._id.toString();
		request.session.username = user.username;
		await request.session.save();
		response.redirect(302, `${origin}/success-login`);
		return;
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

export default withMongoRoute(withSessionRoute(callback));
