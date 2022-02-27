import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {Types} from 'mongoose';
import type {PuzzleInterface} from '@/models/puzzle-model';
import {withSessionRoute} from '@/lib/session';
import {retrieve, remove, update} from '@/controllers/puzzle';

type SuccessData = {
	success: true;
	puzzle?: PuzzleInterface;
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
	const puzzle = await retrieve(id as string);
	if (puzzle === null) {
		response.status(404).json({success: false, error: 'Puzzle not found'});
		return;
	}

	response.json({success: true, puzzle});
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id} = request.query;
	const puzzle = await remove(id as string);
	if (puzzle === null) {
		response.status(404).json({success: false, error: 'Puzzle not found'});
		return;
	}

	response.json({success: true, puzzle});
};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {id}: {id?: Types.ObjectId} = request.query;
	const result = await update(id, JSON.parse(request.body));
	if (result === null) {
		response.status(404).json({success: false, error: 'Puzzle not found'});
		return;
	}

	response.json({success: true});
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
