import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import PuzzleSet from '@/models/puzzle-set-model';
import type {PuzzleSetInterface} from '@/models/puzzle-set-model';
import User from '@/models/user-model';
import type {UserInterface} from '@/models/user-model';
import {withSessionRoute} from '@/lib/session';

const get_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const id = request.session.userID;
	let user: UserInterface;
	try {
		user = await User.findOne({id}).exec();
		if (user === null) {
			response.status(401).send('user not found');
			return;
		}
	} catch (error) {
		console.log(error);
		response.status(401).send('user not found');
		return;
	}

	try {
		const puzzleSets: PuzzleSetInterface[] = await PuzzleSet.find({
			user: user._id,
		}).exec();
		if (puzzleSets.length === 0) {
			response.status(404).send('puzzleSets not found');
			return;
		}

		response.send(puzzleSets);
		return;
	} catch (error) {
		console.log(error);
		response.status(404).send('puzzleSets not found');
	}
};

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			break;

		default:
			response.status(401).send('Method not allowed');
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
