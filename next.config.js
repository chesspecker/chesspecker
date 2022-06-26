/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
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

		/* FIXME: preact compat issue with react 18 https://github.com/preactjs/preact/pull/3568
		// Replace React with Preact only in client production build
		if (!dev && !isServer) {
			Object.assign(config.resolve.alias, {
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
			});
		} */

		config.optimization.minimize = false;
		return config;
	},
};

module.exports = nextConfig;
