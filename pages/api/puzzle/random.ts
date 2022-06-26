import withMongoRoute from 'providers/mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import PuzzleModel, {Puzzle} from '@/models/puzzle';
import type {SuccessData, ErrorData} from '@/types/data';
import {failWrapper, getRandomInt} from '@/lib/utils';

export type PuzzleData = SuccessData<Puzzle> | ErrorData;

const NUMBER_OF_DOCUMENTS = 2_000_000;

const get_ = async (
	_request: NextApiRequest,
	response: NextApiResponse<PuzzleData>,
) => {
	const fail = failWrapper(response);
	const item = getRandomInt(NUMBER_OF_DOCUMENTS);

	try {
		const puzzle = await PuzzleModel.findOne()
			.skip(item)
			.select('PuzzleId')
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
	response: NextApiResponse<PuzzleData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'GET':
			await get_(request, response);
			break;

		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
