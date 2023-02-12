import {z} from 'zod';
import {createTRPCRouter, publicProcedure} from '../trpc';

export const userRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ctx}) => ctx.prisma.user.findMany()),
	getCurrent: publicProcedure.query(async ({ctx}) =>
		ctx.prisma.user.findUnique({
			where: {id: ctx.session.userId},
		}),
	),
	getById: publicProcedure
		.input(z.object({id: z.string()}))
		.query(async ({ctx, input}) =>
			ctx.prisma.user.findUnique({
				where: {id: input.id},
			}),
		),
});
