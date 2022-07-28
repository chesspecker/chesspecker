import type {NextApiRequest, NextApiResponse} from 'next';
import {UpdateQuery} from 'mongoose';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import PuzzleModel, {Puzzle} from '@/models/puzzle';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import {PuzzleItem} from '@/models/puzzle-item';
import {failWrapper} from '@/lib/utils';
import type {SuccessData, ErrorData} from '@/types/data';

export type PuzzleData = SuccessData<Puzzle> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleData>,
) => {
	const fail = failWrapper(response);
	const {id: PuzzleId} = request.query;
	if (!PuzzleId) {
		fail('Missing puzzle id', 400);
		return;
	}

	try {
		const puzzle = await PuzzleModel.findOne({PuzzleId}).lean().exec();
		if (!puzzle) {
			fail('Puzzle not found', 404);
			return;
		}

		response.setHeader(
			'Cache-Control',
			's-maxage=3600, stale-while-revalidate',
		);
		response.json({success: true, data: puzzle});
	} catch (error: unknown) {
		fail((error as Error).message);
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
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing puzzle id', 400);
		return;
	}

	const {_id, update} = JSON.parse(request.body) as BodyPutRequest;
	if (!_id || !update) {
		fail('Missing params in body', 400);
		return;
	}

	try {
		const puzzle = await PuzzleSetModel.findOneAndUpdate(
			{_id, 'puzzles._id': id},
			update,
			{new: true},
		)
			.lean()
			.exec();

		if (!puzzle) {
			fail('Puzzle not found', 404);
			return;
		}

		response.json({success: true, data: puzzle});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleData | PuzzleSetData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'GET':
			await get_(request, response);
			break;

		case 'PUT':
			await put_(request, response);
			break;

		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
