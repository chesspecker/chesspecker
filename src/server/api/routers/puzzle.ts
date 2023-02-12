import {z} from 'zod';
import {createTRPCRouter, publicProcedure} from '../trpc';

export const puzzleRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({id: z.string()}))
		.query(async ({ctx, input}) =>
			ctx.prisma.puzzle.findUnique({
				where: {id: input.id},
			}),
		),
	getByLichessId: publicProcedure
		.input(z.object({lichessId: z.string()}))
		.query(async ({ctx, input}) =>
			ctx.prisma.puzzle.findUnique({
				where: {lichessId: input.lichessId},
			}),
		),
});
