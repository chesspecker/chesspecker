/* eslint-disable */

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
	plugins: [require('@tailwindcss/forms')],
};
