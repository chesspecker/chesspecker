import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {retrieve} from '@/controllers/user';
import {withSessionRoute} from '@/lib/session';
import User, {UserInterface} from '@/models/user-model';

type SuccessDataMany = {
	success: true;
	user: UserInterface;
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

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<DataMany>,
) => {
	const {userID} = request.session;
	const user: UserInterface = await retrieve(userID);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	const body = await JSON.parse(request.body);
	const newUser = await User.findOneAndUpdate(
		{_id: userID, 'validatedAchievements.id': body.achievementId},
		{
			$set: {'validatedAchievements.$.claimed': body.claimed},
		},
	).exec();
	response.json({success: true, user: newUser});
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<DataMany>,
) => {
	const {userID} = request.session;
	const user: UserInterface = await retrieve(userID);
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	const body = await JSON.parse(request.body);
	const newUser = await User.findByIdAndUpdate(userID, {
		$push: {validatedAchievements: {id: body.achievementId, claimed: false}},
	}).exec();
	response.json({success: true, user: newUser});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data | DataMany>,
) => {
	switch (request.method) {
		case 'POST':
			await post_(request, response);
			return;
		case 'PUT':
			await put_(request, response);
			return;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
	}
};

export default withMongoRoute(withSessionRoute(handler));
