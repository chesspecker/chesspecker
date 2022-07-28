import ndjson from 'ndjson';
import fetch from '@vercel/fetch';
import {Activity, LichessToken, LichessUser} from '@/types/lichess';
import {LICHESS_CONFIG, ORIGIN} from '@/config';

const fetcher = fetch();

const getActivity = async (
	accessToken: LichessToken['access_token'],
): Promise<Activity> =>
	new Promise(resolve => {
		const result: Activity = [];

		const onMessage = (object: Activity[0]) => {
			result.push(object);
		};

		const onComplete = () => {
			resolve(result);
		};

		fetcher('https://lichess.org/api/puzzle/activity?max=300', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/x-ndjson',
			},
		}).then(responseStream => {
			if (responseStream.status === 429) throw new Error('Too many requests');
			if (!responseStream?.body) return;
			responseStream.body
				.pipe(ndjson.parse())
				.on('data', onMessage)
				.on('end', onComplete);
		});
	});

const getAccount = async (
	accessToken: LichessToken['access_token'],
): Promise<LichessUser> =>
	fetcher('https://lichess.org/api/account', {
		headers: {Authorization: `Bearer ${accessToken}`},
	})
		.then(async response => response.json() as Promise<LichessUser>)
		.catch((error: unknown) => {
			const error_ = error as Error;
			console.error(error_);
			throw error_;
		});

const getToken = async (
	authCode: string,
	verifier: string,
): Promise<LichessToken> =>
	fetcher('https://lichess.org/api/token', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			grant_type: 'authorization_code',
			redirect_uri: `${ORIGIN}/api/auth/lichess/callback`,
			client_id: LICHESS_CONFIG.clientId,
			code: authCode,
			code_verifier: verifier,
		}),
	})
		.then(async response => response.json() as Promise<LichessToken>)
		.catch((error: unknown) => {
			const error_ = error as Error;
			console.error(error_);
			throw error_;
		});

const getLichess = {
	account: getAccount,
	activity: getActivity,
	token: getToken,
};

export default getLichess;
