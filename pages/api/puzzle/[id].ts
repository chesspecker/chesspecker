import withMongoRoute from 'providers/mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import {UpdateQuery} from 'mongoose';
import {withSessionRoute} from '@/lib/session';
import PuzzleModel, {Puzzle} from '@/models/puzzle';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import type {SuccessData, ErrorData} from '@/types/data';
import {PuzzleItem} from '@/models/puzzle-item';

export type PuzzleData = SuccessData<Puzzle> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleData>,
) => {
	const {id: PuzzleId} = request.query;
	try {
		const puzzle = await PuzzleModel.findOne({PuzzleId}).lean().exec();
		if (puzzle === null) throw new Error('Puzzle not found');
		response.json({success: true, data: puzzle});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

type BodyPutRequest = {
	_id: PuzzleItem['_id'];
	update: UpdateQuery<Partial<PuzzleItem>>;
};

export type PuzzleSetData = SuccessData<PuzzleSet> | ErrorData;

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleSetData>,
) => {
	const {id} = request.query as Record<string, string>;
	const {_id, update} = JSON.parse(request.body) as BodyPutRequest;

	try {
		const puzzle = await PuzzleSetModel.findOneAndUpdate(
			{_id, 'puzzles._id': id},
			update,
			{new: true},
		)
			.lean()
			.exec();
		if (puzzle === null) throw new Error('Puzzle not found');
		response.json({success: true, data: puzzle});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleData | PuzzleSetData>,
) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
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
