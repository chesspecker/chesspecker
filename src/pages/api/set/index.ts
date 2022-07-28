import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from '@/providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import {create} from '@/controllers/create-set';
import PuzzleSetModel, {PuzzleSet} from '@/models/puzzle-set';
import {failWrapper} from '@/lib/utils';
import type {SuccessData, ErrorData} from '@/types/data';
import {ORIGIN} from '@/config';

export type PuzzleSetData = SuccessData<PuzzleSet> | ErrorData;
export type PuzzleSetArrayData = SuccessData<PuzzleSet[]> | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleSetArrayData>,
) => {
	const fail = failWrapper(response);
	const {userID} = request.session;
	if (!userID) {
		response.redirect(302, `${ORIGIN}/api/auth/logout`);
		return;
	}

	const data = await PuzzleSetModel.find({
		user: userID,
	})
		.lean()
		.exec();
	if (!data) {
		fail('Set not found', 404);
		return;
	}

	response.json({success: true, data});
};

const post_ = async (
	request: NextApiRequest,
	response: NextApiResponse<PuzzleSetData>,
) => {
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

	try {
		if (!userID) throw new Error('Missing user id');
		const creation = create(userID, JSON.parse(request.body));
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
	response: NextApiResponse<PuzzleSetData | PuzzleSetArrayData>,
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
