/* eslint-disable no-param-reassign */
import type {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '@/lib/session';
import {failWrapper} from '@/lib/fail-wrapper';
import {prisma} from '@/server/db';
import type {ErrorData} from '@/types/data';
import {getLichess} from '@/lib/get-lichess';
import {env} from '@/env.mjs';

const callback = async (
	request: NextApiRequest,
	response: NextApiResponse<ErrorData>,
) => {
	const fail = failWrapper(response);
	if (request.method !== 'GET') {
		fail('Method not allowed', 405);
		return;
	}

	const {verifier} = request.session;
	if (!verifier) {
		fail('No verifier found');
		return;
	}

	const {code} = request.query as {[key: string]: string};
	if (!code) {
		fail('No code found');
		return;
	}

	try {
		const {access_token: oauthToken} = await getLichess.token(code, verifier);
		const lichessUser = await getLichess.account(oauthToken);
		if (!lichessUser?.id) throw new Error('User login failed');

		const user = await prisma.user.upsert({
			where: {lichessId: lichessUser.id},
			update: {},
			create: {
				lichessId: lichessUser.id,
				username: lichessUser.username,
				streak: {
					create: {
						startDate: new Date(),
						lastLoginDate: new Date(),
					},
				},
			},
		});

		request.session.userId = user?.id;
		request.session.lichessToken = oauthToken;
		request.session.user = user;
		request.session.username = user.username;
		await request.session.save();

		response.redirect(302, `${env.ORIGIN}/success-login`);
		return;
	} catch (error: unknown) {
		fail((error as Error).message);
	}
};

export default withSessionRoute(callback);
