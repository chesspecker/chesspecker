// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	poweredByHeader: false,
	eslint: {
		dirs: ['./src'],
	},
	images: {
		domains: ['s3-alpha-sig.figma.com'],
		formats: ['image/avif', 'image/webp'],
	},
	experimental: {
		swcPlugins: [
			[
				'next-superjson-plugin',
				{
					excluded: [],
				},
			],
		],
	},
	webpack: config => {
		config.module.rules.push({
			test: /\.mp3$/,
			use: [
				{
					loader: 'url-loader',
				},
			],
		});
		return config;
	},
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
};
export default config;
