import {z} from 'zod';

export const createSetParamsShape = z.object({
	title: z.string(),
	themeArray: z.array(z.string()),
	size: z.number(),
	level: z.enum(['easiest', 'easier', 'intermediate', 'harder', 'hardest']),
	averageRating: z.number(),
});

export type CreateSetParams = z.infer<typeof createSetParamsShape>;
