import {ChesscomStats, ChesscomToken, ChesscomUser} from '@/types/chesscom';
import {chesscom, origin} from '@/config';

const getStats = async (
	accessToken: ChesscomToken['access_token'],
	username: string,
): Promise<ChesscomStats> =>
	fetch(`https://api.chess.com/pub/player/${username}/stats`, {
		headers: {Authorization: `Bearer ${accessToken}`},
	})
		.then(async response => response.json() as Promise<ChesscomStats>)
		.catch(error => {
			throw error;
		});

const getAccount = async (
	accessToken: ChesscomToken['access_token'],
	username: string,
): Promise<ChesscomUser> =>
	fetch(`https://api.chess.com/pub/player/${username}`, {
		headers: {Authorization: `Bearer ${accessToken}`},
	})
		.then(async response => response.json() as Promise<ChesscomUser>)
		.catch(error => {
			throw error;
		});

const getToken = async (
	authCode: string | string[],
	verifier: string,
): Promise<ChesscomToken> =>
	fetch('https://oauth.chess.com/token', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			grant_type: 'authorization_code',
			client_id: chesscom.clientId,
			redirect_uri: `${origin}/api/auth/chesscom/callback`,
			code: authCode,
			code_verifier: verifier,
		}),
	})
		.then(async response => response.json() as Promise<ChesscomToken>)
		.catch(error => {
			throw error;
		});

const getChesscom = {
	token: getToken,
	account: getAccount,
	stats: getStats,
};

export default getChesscom;
