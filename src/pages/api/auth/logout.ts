import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/fail-wrapper';
import type {ErrorData} from '@/types/data';
import {env} from '@/env.mjs';

const logoutRoute = (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	const fail = failWrapper(response);
	try {
		request.session.destroy();
	} catch (error: unknown) {
		fail((error as Error).message, 500);
		return;
	}

	response.redirect(302, env.ORIGIN);
};

export default withSessionRoute(logoutRoute);
