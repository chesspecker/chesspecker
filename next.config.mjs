/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
	return config;
}

export default defineNextConfig({
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
});
