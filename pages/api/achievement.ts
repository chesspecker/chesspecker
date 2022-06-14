import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import UserModel, {User} from '@/models/user';
import {SuccessData, ErrorData} from '@/types/data';

export type AchievementData = SuccessData<User> | ErrorData;

type PutRequestBody = {
	achievementId: string;
	claimed: boolean;
};

type PostRequestBody = {achievementId: string};

const put_ = async (
	request: NextApiRequest,
	response: NextApiResponse<AchievementData>,
) => {
	const {userID} = request.session;
	const user = await UserModel.findById(userID).lean().exec();
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	const body = (await JSON.parse(request.body)) as PutRequestBody;
	const newUser = await UserModel.findOneAndUpdate(
		{_id: userID, 'validatedAchievements.id': body.achievementId},
		{$set: {'validatedAchievements.$.claimed': body.claimed}},
	)
		.lean()
		.exec();
	response.json({success: true, data: newUser});
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<AchievementData>,
) => {
	const {userID} = request.session;
	const user = await UserModel.findById(userID).lean().exec();
	if (user === null) {
		response.status(404).json({success: false, error: 'User not found'});
		return;
	}

	const body = (await JSON.parse(request.body)) as PostRequestBody;
	const newUser = await UserModel.findByIdAndUpdate(userID, {
		$push: {
			validatedAchievements: {
				id: body.achievementId,
				claimed: false,
				date: new Date(),
			},
		},
	})
		.lean()
		.exec();
	response.json({success: true, data: newUser});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<AchievementData>,
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
