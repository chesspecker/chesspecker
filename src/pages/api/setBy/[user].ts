import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import {failWrapper} from '@/lib/utils';
import type {SuccessData, ErrorData} from '@/types/data';

export type PuzzleSetArrayData = SuccessData<PuzzleSet[]> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleSetArrayData>,
) => {
	const fail = failWrapper(response);
	const {user} = request.query as Record<string, string>;
	if (!user) {
		fail('Missing id', 400);
		return;
	}

	try {
		const data = await PuzzleSetModel.find({user}).lean().exec();
		if (!data) {
			fail('Sets not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleSetArrayData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'GET':
			await get_(request, response);
			break;

		default:
			failWrapper(response)('Method not allowed', 405);
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
