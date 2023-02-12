import {createTRPCRouter} from './trpc';
import {userRouter} from '@/server/api/routers/user';
import {ratingRouter} from '@/server/api/routers/rating';
import {puzzleSetRouter} from '@/server/api/routers/puzzle-set';
import {puzzleRouter} from '@/server/api/routers/puzzle';

export const appRouter = createTRPCRouter({
	user: userRouter,
	rating: ratingRouter,
	puzzleSet: puzzleSetRouter,
	puzzle: puzzleRouter,
});

export type AppRouter = typeof appRouter;
