import {NextApiRequest, NextApiResponse} from 'next';
import User from '@/models/user-model';
import {withSessionRoute} from '@/lib/session';

const get_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const {username} = request.session;
	response.json({name: username});
};

const test_ = async (request: NextApiRequest, response: NextApiResponse) => {
	response.json({name: 'didier'});
};

const handler = (request: NextApiRequest, response: NextApiResponse) => {};

export default withSessionRoute(get_);
