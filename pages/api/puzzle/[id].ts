import {NextApiRequest, NextApiResponse} from 'next';
import Puzzle from '@/models/puzzle-model';

const get = async (request: NextApiRequest, response: NextApiResponse) => {
	const puzzleId = request.query.id;
	const result = await Puzzle.findById(puzzleId).exec();
	if (result === null) throw new Error('puzzle not found');
	response.send(result);
};

const put = (request: NextApiRequest, response: NextApiResponse) => {};
const handler = (request: NextApiRequest, response: NextApiResponse) => {};

export default handler;
