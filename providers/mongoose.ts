import mongoose from 'mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from '@/config';

const withMongoRoute =
	(handler: (arg0: NextApiRequest, arg1: NextApiResponse) => any) =>
	async (request: NextApiRequest, response: NextApiResponse) => {
		if (mongoose.connections[0].readyState) {
			return handler(request, response);
		}

		await mongoose.connect(db.url);
		return handler(request, response);
	};

export default withMongoRoute;
