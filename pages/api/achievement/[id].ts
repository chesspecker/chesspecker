import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {retrieve} from '@/controllers/user';
import {withSessionRoute} from '@/lib/session';
import User, {UserInterface} from '@/models/user-model';

type SuccessDataMany = {
	success: true;
	achievement: UserInterface;
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

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<DataMany>,
) => {
	const {id} = request.query;

	const result = await Achievement.findById(id).exec();
	response.json({success: true, achievement: result});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data | DataMany>,
) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			return;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
	}
};

export default withMongoRoute(withSessionRoute(handler));
