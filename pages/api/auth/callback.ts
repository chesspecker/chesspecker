import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {origin} from '@/config';
import getLichess from '@/lib/get-lichess';
import User from '@/models/user-model';
import {createFromLichess} from '@/controllers/user';

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

	const {verifier} = request.session;

	try {
		const lichessToken = await getLichess.token(request.query.code, verifier);
		const {access_token: oauthToken} = lichessToken;
		const lichessUser = await getLichess.data(oauthToken);
		if (!lichessUser) throw new Error('user login failed');

		request.session.token = oauthToken;
		request.session.userID = lichessUser.id;
		request.session.username = lichessUser.username;
		await request.session.save();

		const isAlreadyUsedId = await User.exists({id: lichessUser.id});

		if (!isAlreadyUsedId) {
			await createFromLichess(lichessUser);
		}

		response.redirect(302, `${origin}/success-login`);
		return;
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

export default withMongoRoute(withSessionRoute(callback));
