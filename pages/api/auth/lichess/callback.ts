import {withSessionRoute} from 'lib/session';
import withMongoRoute from 'providers/mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import UserModel from '@/models/user';
import {origin} from '@/config';
import getLichess from '@/lib/get-lichess';
import {createLichessUser} from '@/controllers/create-user';
import {failWrapper} from '@/lib/utils';
import type {ErrorData} from '@/types/data';

const callback = async (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	const fail = failWrapper(response);
	if (request.method !== 'GET') {
		fail('Method not allowed.', 405);
		return;
	}

	const {verifier} = request.session;
	if (!verifier) {
		fail('No verifier found.', 400);
		return;
	}

	const {code} = request.query as Record<string, string>;
	if (!code) {
		fail('No code found.', 404);
		return;
	}

	try {
		const {access_token: oauthToken} = await getLichess.token(code, verifier);
		const lichessUser = await getLichess.account(oauthToken);
		if (!lichessUser) throw new Error('user login failed');

		let user = await UserModel.findOne({id: lichessUser.id}).lean().exec();
		if (!user) user = await createLichessUser(lichessUser);
		request.session.type = 'lichess';
		request.session.lichessToken = oauthToken;
		request.session.userID = user._id.toString();
		request.session.username = user.username;
		await request.session.save();
		response.redirect(302, `${origin}/success-login`);
		return;
	} catch (error_: unknown) {
		const error = error_ as Error;
		fail(error.message);
	}
};

export default withMongoRoute(withSessionRoute(callback));
