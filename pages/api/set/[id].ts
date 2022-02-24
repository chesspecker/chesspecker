import {NextApiRequest, NextApiResponse} from 'next';
import PuzzleSet from '@/models/puzzle-set-model';

const get_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const puzzleSetId = request.query.id;
	const result = await PuzzleSet.findById(puzzleSetId).exec();
	if (result === null) throw new Error('puzzleSet not found');
	response.send(result);
};

const delete_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const puzzleSetId = request.query.id;
	const result = await PuzzleSet.deleteOne({_id: puzzleSetId}).exec();
	if (result === null) throw new Error('puzzleSet not found');
	response.send('success');
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			break;

		case 'POST':
			await delete_(request, response);
			break;

		default:
			response.status(401).send('Method not allowed');
			break;
	}
};

export default handler;
