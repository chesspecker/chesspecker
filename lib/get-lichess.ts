import {LichessToken, LichessUser} from '@/types/lichess';
import {LICHESS_CONFIG, ORIGIN} from '@/config';

const getAccount = async (
	accessToken: LichessToken['access_token'],
): Promise<LichessUser> =>
	fetch('https://lichess.org/api/account', {
		headers: {Authorization: `Bearer ${accessToken}`},
	})
		.then(async response => response.json() as Promise<LichessUser>)
		.catch(error => {
			throw error;
		});

const getToken = async (
	authCode: string,
	verifier: string,
): Promise<LichessToken> =>
	fetch('https://lichess.org/api/token', {
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
		.catch(error => {
			throw error;
		});

const getLichess: {
	account: (accessToken: LichessToken['access_token']) => Promise<LichessUser>;
	token: (authCode: string, verifier: string) => Promise<LichessToken>;
} = {
	account: getAccount,
	token: getToken,
};

export default getLichess;
