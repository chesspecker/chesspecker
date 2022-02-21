import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {siteRedirectUrl} from '@/config';
import getLichess from '@/lib/get-lichess';
import User from '@/models/user-model';
import userGenerator from '@/controllers/user-generator';

export type ResponseData = {success: boolean; message?: string};

const callback = async (
	request: NextApiRequest,
	response: NextApiResponse<ResponseData>,
) => {
	if (request.method !== 'GET') {
		response.status(405).json({success: false, message: 'Method not allowed.'});
		return;
	}

	const {verifier} = request.session;

	let oauthToken;
	try {
		const lichessToken = await getLichess.token(request.query.code, verifier);
		oauthToken = lichessToken.access_token;
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, message: error.message});
		return;
	}

	let lichessUser;
	try {
		lichessUser = await getLichess.data(oauthToken);
		if (!lichessUser) throw new Error('user login failed');
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, message: error.message});
		return;
	}

	console.log('lichessUser', lichessUser);

	request.session.token = oauthToken;
	request.session.userID = lichessUser.id;
	request.session.username = lichessUser.username;
	await request.session.save();

	let isAlreadyUsedId;

	try {
		isAlreadyUsedId = await User.exists({id: lichessUser.id});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, message: error.message});
		return;
	}

	if (!isAlreadyUsedId) {
		const user = userGenerator(lichessUser);
		user.save();
	}

	response.redirect(302, `${siteRedirectUrl}/success-login`);
};

export default withMongoRoute(withSessionRoute(callback));
