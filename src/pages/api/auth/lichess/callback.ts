import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import withMongoRoute from '@/providers/mongoose';
import UserModel from '@/models/user';
import getLichess from '@/lib/get-lichess';
import {createLichessUser} from '@/controllers/create-user';
import {failWrapper} from '@/lib/utils';
import {ORIGIN} from '@/config';
import type {ErrorData} from '@/types/data';

const callback = async (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	const fail = failWrapper(response);
	if (request.method !== 'GET') {
		fail('Method not allowed', 405);
		return;
	}

	const {verifier} = request.session;
	if (!verifier) {
		fail('No verifier found');
		return;
	}

	const {code} = request.query as {[key: string]: string};
	if (!code) {
		fail('No code found');
		return;
	}

	try {
		const {access_token: oauthToken} = await getLichess.token(code, verifier);
		const lichessUser = await getLichess.account(oauthToken);
		if (!lichessUser) throw new Error('User login failed');

		let user = await UserModel.findOne({id: lichessUser.id}).lean().exec();
		if (!user) user = await createLichessUser(lichessUser);
		request.session.type = 'lichess';
		request.session.lichessToken = oauthToken;
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
