/** @type {import("prettier").Config} */
module.exports = {
	// @ts-ignore
	...require('@pnxdxt/prettier-config'),
	plugins: [require.resolve('prettier-plugin-tailwindcss')],
};
