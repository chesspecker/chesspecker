import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import Puzzle from '@/models/puzzle-model';

const get_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const puzzleId = request.query.id;
	const result = await Puzzle.findById(puzzleId).exec();
	if (result === null) throw new Error('puzzle not found');
	response.send(result);
};

const put_ = (request: NextApiRequest, response: NextApiResponse) => {};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			break;

		case 'PUT':
			put_(request, response);
			break;

		default:
			response.status(401).send('Method not allowed');
			break;
	}
};

export default withMongoRoute(handler);
