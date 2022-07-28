import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/utils';
import getLichess from '@/lib/get-lichess';
import {ErrorData, SuccessData} from '@/types/data';
import {Activity} from '@/types/lichess';
import {PuzzleSet} from '@/models/puzzle-set';
import {create} from '@/controllers/custom-set';
import {ORIGIN} from '@/config';

export type ResponseData = SuccessData<{activity: Activity}> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<ResponseData>,
) => {
	const fail = failWrapper(response);
	const {userID} = request.session;
	if (!userID) {
		response.redirect(302, `${ORIGIN}/api/auth/logout`);
		return;
	}

	const activity = await getLichess
		.activity(request.session.lichessToken!)
		.catch(error => {
			fail(error.message, error.statusCode);
		});

	if (activity) {
		const data = {activity};
		response.json({success: true, data});
	}
};

const post_ = async (request: NextApiRequest, response: NextApiResponse) => {
	const fail = failWrapper(response);
	const {userID} = request.session;
	if (!userID) {
		response.redirect(302, `${ORIGIN}/api/auth/logout`);
		return;
	}

	const timeout = new Promise((resolve: (response: string) => void) =>
		// eslint-disable-next-line no-promise-executor-return
		setTimeout(resolve, 8000, 'timeout'),
	);

	const guard: (
		data: PuzzleSet | string | undefined,
	) => asserts data is PuzzleSet = data => {
		if (data === null) throw new Error('Unable to create set');
		if (data === 'timeout') throw new Error('Timed out');
	};

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const body: {activity: Activity; name: string} = JSON.parse(request.body);
	try {
		if (!userID) throw new Error('Missing user id');
		const creation = create(userID, body.activity, {title: body.name});
		const data = await Promise.race([creation, timeout]);
		guard(data);
		response.json({success: true, data});
	} catch (error: unknown) {
		const error_ = error as Error;
		console.error(error_);
		fail(error_.message);
	}
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<ResponseData>,
) => {
	switch (request.method?.toUpperCase()) {
		case 'GET':
			await get_(request, response);
			return;

		case 'POST':
			await post_(request, response);
			return;

		default:
			failWrapper(response)('Method not allowed');
	}
};

export default withMongoRoute(withSessionRoute(handler));
