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
	const {id} = request.query as Record<string, string>;

	try {
		const data = await PuzzleSetModel.findById(id).lean().exec();
		if (data === null) {
			failWrapper(response)('Set not found');
			return;
		}

		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

const delete_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SetData>,
) => {
	const {id} = request.query as Record<string, string>;

	try {
		const data = await PuzzleSetModel.findByIdAndDelete(id).lean().exec();
		if (data === null) {
			failWrapper(response)('Set not found');
			return;
		}

		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
	}
};

type PutRequestBody = UpdateQuery<Partial<PuzzleSet>>;

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<SetData>,
) => {
	const {id} = request.query;
	const body = JSON.parse(request.body) as PutRequestBody;
	try {
		const data = await PuzzleSetModel.findByIdAndUpdate(id, body, {
			new: true,
		})
			.lean()
			.exec();
		if (data === null) throw new Error('Set not found');
		response.json({success: true, data});
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
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
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
