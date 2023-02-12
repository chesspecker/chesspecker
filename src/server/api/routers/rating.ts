import {createTRPCRouter, publicProcedure} from '../trpc';
import {getLichess} from '@/lib/get-lichess';
import {getRatingFromUser} from '@/lib/rating';

export const ratingRouter = createTRPCRouter({
	get: publicProcedure.query(async ({ctx}) => {
		const lichessToken = ctx.session.lichessToken;
		if (!lichessToken) return null;
		const user = await getLichess.account(lichessToken);
		return getRatingFromUser(user);
	}),
});
