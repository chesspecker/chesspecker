export interface ChesscomToken {
	access_token: string;
	id_token: string;
	token_type: 'Bearer';
	expires_in: number;
	scope: string;
	refresh_token: string;
}
