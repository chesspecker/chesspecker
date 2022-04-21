import type {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import type {UserInterface} from '@/models/types';
import {withSessionRoute} from '@/lib/session';
import {retrieve, create} from '@/controllers/user';

export type Data =
	| {
			success: true;
			user: UserInterface;
	  }
	| {
			success: false;
			error: string;
	  };

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {userID} = request.session;
	const user = await retrieve(userID);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		throw new Error('User not found');
	}

	response.json({success: true, user});
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const user = await create(request.body);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		throw new Error('User not found');
	}

	response.json({success: true, user});
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
