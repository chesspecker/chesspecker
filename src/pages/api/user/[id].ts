import type {NextApiRequest, NextApiResponse} from 'next';
import type {UpdateQuery} from 'mongoose';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import UserModel, {User} from '@/models/user';
import {failWrapper} from '@/lib/utils';
import {SuccessData, ErrorData} from '@/types/data';

export type UserData = SuccessData<User> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing user id', 400);
		return;
	}

	try {
		const data = await UserModel.findById(id).lean().exec();
		if (!data) {
			fail('User not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing user id', 400);
		return;
	}

	try {
		const data = await UserModel.findByIdAndDelete(id).lean().exec();
		if (!data) {
			fail('User not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<UserData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing user id', 400);
		return;
	}

	const body = JSON.parse(request.body) as UpdateQuery<Partial<User>>;
	if (!body) {
		fail('Missing request body', 400);
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

		response.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate');
		response.json({success: true, data});
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

		case 'DELETE':
			await delete_(request, response);
			break;

		case 'PUT':
			await put_(request, response);
			break;

		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
