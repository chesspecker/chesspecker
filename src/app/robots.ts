import {MetadataRoute} from 'next';

const robots = (): MetadataRoute.Robots => ({
	rules: {
		userAgent: '*',
		allow: '/',
	},
	host: 'https://chesspecker.com',
	sitemap: 'https://chesspecker.com/sitemap.xml',
});

export default robots;
