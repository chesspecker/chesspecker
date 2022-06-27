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
};
