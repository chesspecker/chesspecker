import {createTRPCRouter, publicProcedure} from '../trpc';
import {createSet} from '@/server/api/controllers/puzzle-set/create-set';
import {createSetParamsShape} from '@/types/create-set-params';

export const puzzleSetRouter = createTRPCRouter({
	create: publicProcedure
		.input(createSetParamsShape)
		.mutation(async ({ctx, input}) => createSet({ctx, input})),
});
