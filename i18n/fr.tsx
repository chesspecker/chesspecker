import type {Locale} from '@/types/i18n';

export const table: Locale = {
	locale: 'Français',
	'success-login': {
		hello: 'Salut {{username}} 👋',
		welcome: 'Bienvenue sur chesspecker',
		button: 'EN AVANT ! 🔥',
	},
	'404': {
		title: 'Looks like you are lost...',
		button: 'RETURN HOME',
	},
	'500': {
		title: 'Looks like you are lost...',
		button: 'RETURN HOME',
	},
	cancel: {
		title: 'Looks like you are lost...',
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
