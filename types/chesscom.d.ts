export interface ChesscomToken {
	access_token: string;
	id_token: string;
	token_type: 'Bearer';
	expires_in: number;
	scope: string;
	refresh_token: string;
}

export interface ChesscomUser {
	'@id': string; // The location of this profile (always self-referencing)
	url: string; // The chess.com user's profile page (the username is displayed with the original letter case)
	username: string; // The username of this player
	player_id: number; // The non-changing Chess.com ID of this player
	title: string; // (optional) abbreviation of chess title, if any
	status: string; // Account status: closed, closed:fair_play_violations, basic, premium, mod, staff
	name: string; // (optional) the personal first and last name
	avatar: string; // (optional) URL of a 200x200 image
	location: string; // (optional) the city or location
	country: string; // API location of this player's country's profile
	joined: number; // Timestamp of registration on Chess.com
	last_online: number; // Timestamp of the most recent login
	followers: number; // The number of players tracking this player's activity
	is_streamer: boolean; // If the member is a Chess.com streamer
	twitch_url: string;
	fide: number; // FIDE rating
}

interface ChesscomStatItem {
	last?: {
		// The current stats
		date: number; // Timestamp of the last rated game finished
		rating: number; // Most-recent rating
		rd: number; // The Glicko "RD" value used to calculate ratings changes
	};
	best?: {
		// The best rating achieved by a win
		date: number; // Timestamp of the best-win game
		rating: number; // Highest rating achieved
		game: string; // URL of the best-win game
	};
	record?: {
		// Summary of all games played
		win?: number; // Number of games won
		loss?: number; // Number of games lost
		draw?: number; // Number of games drawn
		time_per_move: number; // Integer number of seconds per average move
		timeout_percent: number; // Timeout percentage in the last 90 days
	};
	tournament?: {
		// Summary of tournaments participated in
		count: number; // Number of tournaments joined
		withdraw?: number; // Number of tournaments withdrawn from
		points: number; // Total number of points earned in tournaments
		highest_finish: number; // Best tournament place
	};
}

type ChesscomStats = Record<string, ChesscomStatItem>;
