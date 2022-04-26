import withMongoRoute from 'providers/mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import {create} from '@/controllers/puzzle';
import type {PuzzleInterface} from '@/models/types';

type SuccessData = {
	success: true;
	puzzle: PuzzleInterface;
};

type ErrorData = {
	success: false;
	error: string;
};

type Data = SuccessData | ErrorData;

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const puzzle = await create(request.body);
	if (puzzle === null) {
		response.status(404).json({success: false, error: 'Puzzle not found'});
		return;
	}

	response.json({success: true, puzzle});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'POST':
			await post_(request, response);
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
