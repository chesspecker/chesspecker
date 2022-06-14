import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import {origin} from '@/config';
import type {ErrorData} from '@/types/data';

const logoutRoute = (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	if (request.method !== 'GET') {
		response.status(405).json({success: false, error: 'Method not allowed.'});
		return;
	}

	try {
		request.session.destroy();
	} catch (error_: unknown) {
		const error = error_ as Error;
		response.status(500).json({success: false, error: error.message});
		return;
	}

	response.redirect(302, origin);
};

export default withSessionRoute(logoutRoute);
