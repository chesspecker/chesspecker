import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import getLichess from '@/lib/get-lichess';
import {Perfs} from '@/types/lichess';
import getChesscom from '@/lib/get-chesscom';
import {SuccessData, ErrorData} from '@/types/data';

export type Data = SuccessData<number> | ErrorData;

const getLichessRating = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {lichessToken} = request.session;
	const user = await getLichess.account(lichessToken);

	let perfs = 0;
	let gamesPlayed = 0;
	for (const [, value] of Object.entries(user.perfs)) {
		if (!(value as any)?.games) continue;
		const {games, rating} = value as Perfs;
		gamesPlayed += games;
		perfs += games * rating;
	}

	const average = Math.round(perfs / gamesPlayed);
	response.json({success: true, data: average});
};

const getChesscomRating = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	const {chesscomToken, username} = request.session;
	const stats = await getChesscom.stats(chesscomToken, username);

	let perfs = 0;
	let gamesPlayed = 0;
	for (const [, value] of Object.entries(stats)) {
		if (value?.record?.win < 1) continue;
		const games = value.record.win + value.record.loss;
		const rating = value.last.rating;
		gamesPlayed += games;
		perfs += games * rating;
	}

	const average = Math.round(perfs / gamesPlayed);
	response.json({success: true, data: average});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'GET':
			if (!request?.session?.userID) {
				response.status(401).json({success: false, error: 'Not logged in'});
				return;
			}

			if (request.session.type === 'lichess') {
				await getLichessRating(request, response);
				return;
			}

			if (request.session.type === 'chesscom') {
				await getChesscomRating(request, response);
				return;
			}

			response.status(500).json({success: false, error: 'Session error.'});
			break;

		default:
			response.status(405).json({success: false, error: 'Method not allowed'});
			break;
	}
};

export default withMongoRoute(withSessionRoute(handler));
