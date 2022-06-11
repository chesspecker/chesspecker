import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {createChesscomUser, createLichessUser} from '@/controllers/create-user';
import {SuccessData, ErrorData} from '@/types/data';
import {failWrapper} from '@/lib/utils';
import UserModel, {User} from '@/models/user';

export type UserData = SuccessData<User> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {userID} = request.session;
	if (!userID) {
		fail('Missing user id');
		return;
	}

	try {
		const data = await UserModel.findById(userID).lean().exec();
		if (data === null) {
			fail('User not found');
			return;
		}

		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	let user: User;
	if (request.session.type === 'chesscom')
		user = await createChesscomUser(request.body);
	if (request.session.type === 'lichess')
		user = await createLichessUser(request.body);

	if (user === null) {
		failWrapper(response)('User not found');
		return;
	}

	response.json({success: true, data: user});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			break;

		case 'POST':
			await post_(request, response);
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
