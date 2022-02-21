import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import PuzzleSet from '@/models/puzzle-set-model';
import User, {UserInterface} from '@/models/user-model';
import setGenerator from '@/controllers/set-generator';
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

	const puzzleSets = await PuzzleSet.find({user: user._id}).exec();
	if (puzzleSets.length === 0) {
		response.status(404).send('puzzleSets not found');
		return;
	}

	response.send(puzzleSets);
};

const post_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const id = request.session.userID;
	let user;
	try {
		user = await User.findOne({id}).exec();
		if (user === null) {
			const error = new Error('user not found');
			throw error;
		}
	} catch (error) {
		console.log(error);
		return;
	}

	const {themeArray, size, title, level} = request.body;
	const options = {themeArray, size, title, level};

	let puzzleSet;
	try {
		puzzleSet = await setGenerator(user, options);
	} catch (error) {
		console.log(error);
		return;
	}

	try {
		await puzzleSet.populate('user');
		await puzzleSet.populate('puzzles');
	} catch (error) {
		console.log(error);
		return;
	}

	let puzzleSetId;
	puzzleSet.save(async (error, item) => {
		if (error) console.log(error);
		return;
		puzzleSetId = item._id;
		response.send(puzzleSetId);
	});
};

const handler = (request: NextApiRequest, response: NextApiResponse) => {
	switch (request.method) {
		case 'GET':
			get_(request, response);
			break;

		case 'POST':
			post_(request, response);
			break;

		default:
			response.status(401).send('Method not allowed');
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
