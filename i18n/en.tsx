// TODO: import type {Locale} from '@/types/i18n';

export interface Locale {
	locale: string;
	'success-login': {
		hello: string;
		welcome: string;
		button: string;
	};
	'404': {
		title: string;
		button: string;
	};
	'500': {
		title: string;
		button: string;
	};
	cancel: {
		title: string;
		button: string;
	};
	create: {
		title: string;
		button: string;
	};
	options: {
		title: string;
		button: {base: string; loading: string};
		textInput: {label: string; placeholder: string};
		level: {label: string};
		size: {label: string};
	};
	navbar: Record<string, unknown>;
	burgerMenu: Record<string, unknown>;
}

export const table: Locale = {
	locale: 'English',
	'success-login': {
		hello: 'Hello {{username}} 👋',
		welcome: 'Welcome to chesspecker',
		button: "LET'S GO! 🔥",
	},
	'404': {
		title: 'Looks like you are lost...',
		button: 'RETURN HOME',
	},
	'500': {
		title: 'Looks like something went wrong...',
		button: 'RETURN HOME',
	},
	cancel: {
		title: 'Looks like something went wrong...',
		button: 'RETURN HOME',
	},
	create: {
		title: 'Select one or more category to create your set!',
		button: 'NEXT',
	},
	options: {
		title: 'One last thing...',
		button: {
			base: "LET'S GO! 🎉",
			loading: 'Loading...',
		},
		textInput: {
			label: 'Give your set a name',
			placeholder: 'ex: Road to 2300 elo :)',
		},
		level: {
			label: 'Difficulty level',
		},
		size: {
			label: 'Number of puzzles',
		},
	},
};
