import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import type {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {withSessionRoute} from '@/lib/session';
import {retrieve, remove, update} from '@/controllers/set';

type SuccessData = {
	success: true;
	set: PuzzleSetInterface;
};

type ErrorData = {
	success: false;
	error: string;
};

export type Data = SuccessData | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const set = await retrieve(id as string);
	if (set === null) {
		response.status(404).json({success: false, error: 'Set not found'});
		return;
	}

	response.json({success: true, set});
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const set = await remove(id as string);
	if (set === null) {
		response.status(404).json({success: false, error: 'Set not found'});
		return;
	}

	response.json({success: true, set});
};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const set = await update(id as string, request.body);
	if (set === null) {
		response.status(404).json({success: false, error: 'Set not found'});
		return;
	}

	response.json({success: true, set});
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
