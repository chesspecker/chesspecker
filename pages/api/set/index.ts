import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import type {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {withSessionRoute} from '@/lib/session';
import {create, retrieveByUser} from '@/controllers/set';

type SuccessData = {
	success: true;
	set: PuzzleSetInterface;
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
	const {userID} = request.session;
	const set = await retrieveByUser(userID);
	if (set === null) {
		response.status(404).json({success: false, error: 'Set not found'});
		return;
	}

	response.json({success: true, set});
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {userID} = request.session;
	const set = await create(userID, request.body);
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

		case 'POST':
			await post_(request, response);
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
