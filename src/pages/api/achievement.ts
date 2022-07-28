import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import UserModel, {User} from '@/models/user';
import {failWrapper} from '@/lib/utils';
import {SuccessData, ErrorData} from '@/types/data';
import {ORIGIN} from '@/config';

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
	if (!userID) {
		response.redirect(302, `${ORIGIN}/api/auth/logout`);
		return;
	}

	const fail = failWrapper(response);
	const body = (await JSON.parse(request.body)) as PutRequestBody;
	if (!body) {
		fail('Missing body', 400);
		return;
	}

	try {
		const user = await UserModel.findById(userID).lean().exec();
		if (!user) {
			fail('User not found', 404);
			return;
		}

		const newUser = await UserModel.findOneAndUpdate(
			{_id: userID, 'validatedAchievements.id': body.achievementId},
			{$set: {'validatedAchievements.$.claimed': body.claimed}},
		)
			.lean()
			.exec();

		if (!newUser) {
			fail('User not found', 404);
			return;
		}

		response.json({success: true, data: newUser});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<AchievementData>,
) => {
	const {userID} = request.session;
	if (!userID) {
		response.redirect(302, `${ORIGIN}/api/auth/logout`);
		return;
	}

	const fail = failWrapper(response);
	const body = (await JSON.parse(request.body)) as PostRequestBody;
	if (!body) {
		fail('Missing body', 400);
		return;
	}

	try {
		const user = await UserModel.findById(userID).lean().exec();
		if (!user) {
			fail('User not found', 404);
			return;
		}

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

		if (!newUser) {
			fail('User not found', 404);
			return;
		}

		response.json({success: true, data: newUser});
	} catch (error: unknown) {
		fail((error as Error).message);
	}
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
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
