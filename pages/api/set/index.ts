import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {create, retrieveByUser} from '@/controllers/set';

import type {PuzzleSetInterface} from '@/types/models';

type SuccessDataMany = {
	success: true;
	sets: PuzzleSetInterface[];
};

type SuccessData = {
	success: true;
	set: PuzzleSetInterface;
};

type ErrorData = {
	success: false;
	error: string;
};

export type Data = SuccessData | ErrorData;
export type DataMany = SuccessDataMany | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<DataMany>,
) => {
	const {userID} = request.session;
	const sets = await retrieveByUser(userID);
	if (sets === null) {
		response.status(404).json({success: false, error: 'Set not found'});
		throw new Error('Set not found');
	}

	response.json({success: true, sets});
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {userID} = request.session;

	const timeout = new Promise((resolve: (response: string) => void) =>
		// eslint-disable-next-line no-promise-executor-return
		setTimeout(resolve, 8000, 'timeout'),
	);

	const creation = create(userID, JSON.parse(request.body));

	try {
		const value = await Promise.race([creation, timeout]);
		if (value === null) {
			const error = 'Unable to create set';
			response.status(500).json({success: false, error});
			throw new Error(error);
		}

		if (value === 'timeout') {
			const error = 'timeout';
			response.status(504).json({success: false, error});
			throw new Error(error);
		}

		response.json({success: true, set: value as PuzzleSetInterface});
	} catch (error: unknown) {
		const error_ = error as Error;
		console.error(error_);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data | DataMany>,
) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			return;

		case 'POST':
			await post_(request, response);
			return;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
	}
};

export default withMongoRoute(withSessionRoute(handler));
