import mongoose from 'mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {NextApiHandler} from 'next/types';
import {db} from '@/config';

const withMongoRoute =
	(handler: NextApiHandler) =>
	async (request: NextApiRequest, response: NextApiResponse) => {
		if (mongoose.connections[0].readyState) {
			await handler(request, response);
			return;
		}

		await mongoose.connect(db.url);
		await handler(request, response);
	};

export default withMongoRoute;
