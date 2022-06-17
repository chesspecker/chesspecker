import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import type {UpdateQuery} from 'mongoose';
import {withSessionRoute} from '@/lib/session';
import {SuccessData, ErrorData} from '@/types/data';
import UserModel, {User} from '@/models/user';
import {failWrapper} from '@/lib/utils';

export type UserData = SuccessData<User> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);

	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing user id');
		return;
	}

	try {
		const data = await UserModel.findById(id).lean().exec();
		if (!data) {
			fail('User not found');
			return;
		}

		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		fail(error.message);
	}
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;

	if (!id) {
		fail('Missing user id');
		return;
	}

	try {
		const data = await UserModel.findByIdAndDelete(id).lean().exec();

		if (!data) {
			fail('User not found');
			return;
		}

		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		fail(error.message);
	}
};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;

	if (!id) {
		fail('Missing user id');
		return;
	}

	const body = JSON.parse(request.body) as UpdateQuery<Partial<User>>;

	if (!body) {
		fail('Missing request body');
		return;
	}

	try {
		const data = await UserModel.findByIdAndUpdate(id, body, {
			new: true,
		})
			.lean()
			.exec();

		if (!data) {
			fail('Update failed');
			return;
		}

		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		fail(error.message);
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

		case 'DELETE':
			await delete_(request, response);
			break;

		case 'PUT':
			await put_(request, response);
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
