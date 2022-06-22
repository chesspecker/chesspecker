import {withSessionRoute} from 'lib/session';
import type {NextApiRequest, NextApiResponse} from 'next';
import {origin} from '@/config';
import type {ErrorData} from '@/types/data';
import {failWrapper} from '@/lib/utils';

const logoutRoute = (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	const fail = failWrapper(response);
	if (request.method !== 'GET') {
		fail('Method not allowed', 405);
		return;
	}

	try {
		request.session.destroy();
	} catch (error: unknown) {
		fail((error as Error).message, 500);
		return;
	}

	response.redirect(302, origin);
};

export default withSessionRoute(logoutRoute);
