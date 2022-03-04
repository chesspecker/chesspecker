import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import type {UserInterface} from '@/models/user-model';
import {withSessionRoute} from '@/lib/session';
import {retrieve, remove, update} from '@/controllers/user';

type SuccessData = {
	success: true;
	user: UserInterface;
};

type ErrorData = {
	success: false;
	error: string;
};

type Data = SuccessData | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const user = await retrieve(id as string);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	response.json({success: true, user});
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const user = await remove(id as string);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	response.json({success: true, user});
};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const user = await update(id as string, request.body);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	response.json({success: true, user});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
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
