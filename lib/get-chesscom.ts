import {ChesscomToken} from '@/types/chesscom';
import {chesscom, origin} from '@/config';

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
};

export default getChesscom;
