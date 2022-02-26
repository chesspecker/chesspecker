import mongoose from 'mongoose';
import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from '@/config';

const withMongoRoute =
	(handler: (arg0: NextApiRequest, arg1: NextApiResponse) => void) =>
	async (request: NextApiRequest, response: NextApiResponse) => {
		if (mongoose.connections[0].readyState) {
			handler(request, response);
			return;
		}

		await mongoose.connect(db.url);
		handler(request, response);
	};

export default withMongoRoute;
