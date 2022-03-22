import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {retrieve, remove, update} from '@/controllers/user';

import {withSessionRoute} from '@/lib/session';

type SuccessDataMany = {
	success: true;
	message: string;
};

type SuccessData = {
	success: true;
};

type ErrorData = {
	success: false;
	error: string;
};

export type Data = SuccessData | ErrorData;
export type DataMany = SuccessDataMany | ErrorData;

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<DataMany>,
) => {
	const {userID} = request.session;
	const {achievementId} = request.body;
	const user = await retrieve(userID as string);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}
	const {achievements} = user;

	if (achievements[achievementId]) {
		response.status(200).json({success: true, message: 'achievement already'});
		return;
	}

	const body = {
		$push: {
			achievement: {id: achievementId, claimed: false},
		},
	};

	const newUser = await update(userID as string, body);

	response.json({success: true user:newUser});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data | DataMany>,
) => {
	switch (request.method) {
		case 'POST':
			await post_(request, response);
			return;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
	}
};

export default withMongoRoute(withSessionRoute(handler));
