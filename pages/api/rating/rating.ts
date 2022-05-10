import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import getLichess from '@/lib/get-lichess';
import {Perfs} from '@/types/lichess';

type SuccessData = {
	success: true;
	rating: number;
};

type ErrorData = {
	success: false;
	error: string;
};

export type Data = SuccessData | ErrorData;

const get_ = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {token} = request.session;
	const user = await getLichess.account(token);

	let perfs = 0;
	let gamesPlayed = 0;
	for (const [, value] of Object.entries(user.perfs)) {
		if (!(value as any)?.games) continue;
		const {games, rating} = value as Perfs;
		gamesPlayed += games;
		perfs += games * rating;
	}

	const average = Math.round(perfs / gamesPlayed);
	response.json({success: true, rating: average});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'GET':
			await get_(request, response);
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
