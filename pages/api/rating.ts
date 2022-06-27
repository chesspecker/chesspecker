import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';
import {withSessionRoute} from '@/lib/session';
import getLichess from '@/lib/get-lichess';
import {Perfs} from '@/types/lichess';
import getChesscom from '@/lib/get-chesscom';
import {SuccessData, ErrorData} from '@/types/data';
import {failWrapper} from '@/lib/utils';

export type RatingData = SuccessData<number> | ErrorData;

const getLichessRating = async (
	request: NextApiRequest,
	response: NextApiResponse<RatingData>,
) => {
	const {lichessToken} = request.session;
	if (!lichessToken) {
		response.redirect(302, `${origin}/logout`);
		return;
	}

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
	response: NextApiResponse<RatingData>,
) => {
	const {chesscomToken, username} = request.session;
	if (!chesscomToken || !username) {
		response.redirect(302, `${origin}/logout`);
		return;
	}

	const stats = await getChesscom.stats(chesscomToken, username);

	let perfs = 0;
	let gamesPlayed = 0;
	for (const [, value] of Object.entries(stats)) {
		const won = value.record?.win;
		const lost = value.record?.loss;
		if (!won || won < 1 || !lost || lost < 1) continue;
		const games = won + lost;
		const rating = value.last?.rating;
		gamesPlayed += games;
		if (rating) perfs += games * rating;
	}

	const average = Math.round(perfs / gamesPlayed);
	response.json({success: true, data: average});
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<RatingData>,
) => {
	const fail = failWrapper(response);
	switch (request.method) {
		case 'GET':
			if (!request?.session?.userID) {
				response.redirect(302, `${origin}/logout`);
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

			fail('Session error', 500);
			break;

		default:
			failWrapper(response)('Method not allowed', 405);
	}
};

export default withMongoRoute(withSessionRoute(handler));
