import type {NextApiRequest, NextApiResponse} from 'next';
import PuzzleSet from '@/models/puzzle-set-model';

const put_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const puzzleSetId = request.query.id;
	const {title} = request.body;
	if (title) {
		try {
			await PuzzleSet.updateOne({_id: puzzleSetId}, {$set: {title}}).exec();
		} catch (error) {
			console.log(error);
			return;
		}

		response.send('success');
	} else {
		const error = new Error('Empty request');
		console.log(error);
	}
};

const handler = (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'PUT':
			put_(request, response);
			break;

		default:
			response.status(401).send('Method not allowed');
			break;
	}
};

export default handler;
