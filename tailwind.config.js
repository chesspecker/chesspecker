/* eslint-disable no-dupe-keys */
const plugin = require('tailwindcss/plugin');

module.exports = {
	content: [
		'./components/**/*.{js,ts,jsx,tsx}',
		'./layouts/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				merriweather: ['"Merriweather Sans"'],
			},
			keyframes: {
				wrongMove: {
					'0%': {
						'box-shadow': '0 0 100px 8px red',
					},
					'100%': {
						'box-shadow': 'none',
					},
				},
				rightMove: {
					'0%': {
						'box-shadow': '0 0 100px 8px green',
					},
					'100%': {
						'box-shadow': 'none',
					},
				},
				finishMove: {
					'0%': {
						'box-shadow': '0 0 100px 8px yellow',
					},
					'100%': {
						'box-shadow': 'none',
					},
				},
			},
			animation: {
				wrongMove: 'wrongMove 0.6s ease-in-out 1',
				rightMove: 'rightMove 0.6s ease-in-out 1',
				finishMove: 'finishMove 0.6s ease-in-out 1',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
		plugin(function ({addUtilities}) {
			const newUtilities = {
				'.safe-top': {
					paddingTop: 'constant(safe-area-inset-top)',
					paddingTop: 'env(safe-area-inset-top)',
				},
				'.safe-left': {
					paddingLeft: 'constant(safe-area-inset-left)',
					paddingLeft: 'env(safe-area-inset-left)',
				},
				'.safe-right': {
					paddingRight: 'constant(safe-area-inset-right)',
					paddingRight: 'env(safe-area-inset-right)',
				},
				'.safe-bottom': {
					paddingBottom: 'constant(safe-area-inset-bottom)',
					paddingBottom: 'env(safe-area-inset-bottom)',
				},
				'.disable-scrollbars': {
					scrollbarWidth: 'none',
					'-ms-overflow-style': 'none',
					'&::-webkit-scrollbar': {
						width: '0px',
						background: 'transparent',
						display: 'none',
					},
					'& *::-webkit-scrollbar': {
						width: '0px',
						background: 'transparent',
						display: 'none',
					},
					'& *': {
						scrollbarWidth: 'none',
						'-ms-overflow-style': 'none',
					},
				},
			};

			addUtilities(newUtilities);
		}),
	],
};
