/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === 'development',
	},
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['localhost'],
	},
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
	webpack: (config, {dev, isServer}) => {
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

		// Replace React with Preact only in client production build
		if (!dev && !isServer) {
			Object.assign(config.resolve.alias, {
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
			});
		}

		return config;
	},
};

const withPWA = require('next-pwa');
const withTM = require('next-transpile-modules')([]);

module.exports = withPWA(withTM(nextConfig));
