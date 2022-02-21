import {lichess, origin} from '@/config';

const getLichessData = async (accessToken: string, url = '') =>
	fetch(`https://lichess.org/api/account${url}`, {
		headers: {Authorization: `Bearer ${accessToken}`},
	})
		.then(async response => response.json())
		.catch(error => {
			throw error;
		});

const getLichessToken = async (
	authCode: string | string[],
	verifier: string,
): Promise<any> =>
	fetch('https://lichess.org/api/token', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			grant_type: 'authorization_code',
			redirect_uri: `${origin}/api/auth/callback`,
			client_id: lichess.clientId,
			code: authCode,
			code_verifier: verifier,
		}),
	})
		.then(async response => response.json())
		.catch(error => {
			throw error;
		});

const getLichess = {
	data: getLichessData,
	token: getLichessToken,
};

export default getLichess;
