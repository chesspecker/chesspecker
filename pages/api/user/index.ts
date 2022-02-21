import {NextApiRequest, NextApiResponse} from 'next';
import User from '@/models/user-model';

const get_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const {userID} = request.session;
	const result = await User.findOne({id: userID}).exec();
	if (result === null) throw new Error('user not found');
	response.send(result);
};

const handler = (request: NextApiRequest, response: NextApiResponse) => {};

export default handler;
