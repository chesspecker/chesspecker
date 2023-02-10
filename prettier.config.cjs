/** @type {import("prettier").Config} */
module.exports = {
	...require('@pnxdxt/prettier-config'),
	plugins: [require.resolve('prettier-plugin-tailwindcss')],
};
