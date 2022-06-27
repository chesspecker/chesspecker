/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['localhost'],
	},
	i18n: {
		locales: ['en', 'fr'],
		defaultLocale: 'en',
	},
	experimental: {
		outputStandalone: true,
	},
	webpack: config => {
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
		config.optimization.minimize = false;
		return config;
	},
};

module.exports = nextConfig;
