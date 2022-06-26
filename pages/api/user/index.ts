import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {createChesscomUser, createLichessUser} from '@/controllers/create-user';
import {SuccessData, ErrorData} from '@/types/data';
import {failWrapper} from '@/lib/utils';
import UserModel, {User} from '@/models/user';
import {ORIGIN} from '@/config';

export type UserData = SuccessData<User> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {userID} = request.session;
	if (!userID) {
		response.redirect(302, `${ORIGIN}/logout`);
		return;
	}

	try {
		const data = await UserModel.findById(userID).lean().exec();
		if (!data) {
			fail('User not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);

	try {
		const user: User =
			request.session.type === 'chesscom'
				? await createChesscomUser(request.body)
				: await createLichessUser(request.body);

		if (!user) {
			fail('User not found', 404);
			return;
		}

		response.json({success: true, data: user});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'GET':
			await get_(request, response);
			break;

		case 'POST':
			await post_(request, response);
			break;

		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
