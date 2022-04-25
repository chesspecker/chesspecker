/**
 * @type {import('next').NextConfig}
 **/

const withPWA = require('next-pwa');
const nextConfig = {
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
	},
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		outputStandalone: true,
	},
	webpackDevMiddleware: config => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		};
		return config;
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.(ogg|mp3|wav|mpe?g)$/i,
			use: [
				{
					loader: 'url-loader',
					options: {
						name: '[name]-[hash].[ext]',
					},
				},
			],
		});
		return config;
	},
};

const withTM = require('next-transpile-modules')([]);

module.exports = withPWA(withTM(nextConfig));
