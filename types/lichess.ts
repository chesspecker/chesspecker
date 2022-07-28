export type LichessToken = {
	token_type: 'Bearer';
	access_token: string;
	expires_in: number;
};

export type Perfs = {
	games: number;
	rating: number;
	rd: number;
	prog: number;
	prov: boolean;
};

export type LichessUser = {
	id: string;
	username: string;
	online: boolean;
	perfs: {
		chess960?: Perfs;
		atomic?: Perfs;
		racingKings?: Perfs;
		ultraBullet?: Perfs;
		blitz?: Perfs;
		kingOfTheHill?: Perfs;
		bullet?: Perfs;
		correspondence?: Perfs;
		horde?: Perfs;
		puzzle?: Perfs;
		classical?: Perfs;
		rapid?: Perfs;
		storm?: {
			runs: number;
			score: number;
		};
	};
	createdAt: number;
	disabled: boolean;
	tosViolation: boolean;
	profile: {
		country: string;
		location: string;
		bio: string;
		firstName: string;
		lastName: string;
		fideRating: number;
		uscfRating: number;
		ecfRating: number;
		links: string;
	};
	seenAt: number;
	patron: boolean;
	verified: boolean;
	playTime: {
		total: number;
		tv: number;
	};
	title:
		| 'GM'
		| 'WGM'
		| 'IM'
		| 'WIM'
		| 'FM'
		| 'WFM'
		| 'NM'
		| 'CM'
		| 'WCM'
		| 'WNM'
		| 'LM'
		| 'BOT';
	url: string;
	playing: string;
	completionRate: number;
	count: {
		all: number;
		rated: number;
		ai: number;
		draw: number;
		drawH: number;
		loss: number;
		lossH: number;
		win: number;
		winH: number;
		bookmark: number;
		playing: number;
		import: number;
		me: number;
	};
	streaming: boolean;
	followable: boolean;
	following: boolean;
	blocking: boolean;
	followsYou: boolean;
};
