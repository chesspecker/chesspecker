import {MetadataRoute} from 'next';

const sitemap = (): MetadataRoute.Sitemap => [
	{
		url: 'https://chesspecker.com',
		lastModified: new Date(),
	},
];

export default sitemap;
