import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import type {UpdateQuery} from 'mongoose';
import {withSessionRoute} from '@/lib/session';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import {failWrapper} from '@/lib/utils';
import type {SuccessData, ErrorData} from '@/types/data';

export type SetData = SuccessData<PuzzleSet> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SetData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing id', 400);
		return;
	}

	try {
		const data = await PuzzleSetModel.findById(id).lean().exec();
		if (!data) {
			fail('Set not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SetData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing id', 400);
		return;
	}

	try {
		const data = await PuzzleSetModel.findByIdAndDelete(id).lean().exec();
		if (!data) {
			fail('Set not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

type PutRequestBody = UpdateQuery<Partial<PuzzleSet>>;

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SetData>,
) => {
	const fail = failWrapper(response);
	const {id} = request.query as Record<string, string>;
	if (!id) {
		fail('Missing id', 400);
		return;
	}

	const body = JSON.parse(request.body) as PutRequestBody;
	if (!body) {
		fail('Missing body', 400);
		return;
	}

	try {
		const data = await PuzzleSetModel.findByIdAndUpdate(id, body, {
			new: true,
		})
			.lean()
			.exec();
		if (data === null) {
			fail('Set not found', 404);
			return;
		}

		response.json({success: true, data});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<SetData>,
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
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
