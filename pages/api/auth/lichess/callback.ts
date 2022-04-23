import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {origin} from '@/config';
import getLichess from '@/lib/get-lichess';
import User, {UserInterface} from '@/models/user-model';
import {create} from '@/controllers/user';

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

	try {
		const {verifier} = request.session;
		const lichessToken = await getLichess.token(request.query.code, verifier);
		const oauthToken = lichessToken.access_token;
		const lichessUser = await getLichess.account(oauthToken);
		if (!lichessUser) throw new Error('user login failed');

		let user: UserInterface = await User.findOne({id: lichessUser.id});
		if (!user) user = await create(lichessUser);
		request.session.type = 'lichess';
		request.session.lichessToken = oauthToken;
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
