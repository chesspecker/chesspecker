import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import {origin} from '@/config';

export type ResponseData = {success: boolean; message?: string};

const logoutRoute = (
	request: NextApiRequest,
	response: NextApiResponse<ResponseData>,
) => {
	if (request.method !== 'GET') {
		response.status(405).json({success: false, message: 'Method not allowed.'});
		return;
	}

	try {
		request.session.destroy();
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, message: error.message});
		return;
	}

	response.redirect(302, origin);
};

export default withSessionRoute(logoutRoute);
