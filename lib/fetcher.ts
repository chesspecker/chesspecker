import {origin} from '@/config';

export const fetcher = {
	get: async (url: string) =>
		fetch(`${origin}${url}`).then(async res => res.json()),
	post: async (url: string, data: any) =>
		fetch(`${origin}${url}`, {method: 'POST', body: JSON.stringify(data)}).then(
			async res => res.json(),
		),
	put: async (url: string, data: any) =>
		fetch(`${origin}${url}`, {method: 'PUT', body: JSON.stringify(data)}).then(
			async res => res.json(),
		),
	delete: async (url: string) =>
		fetch(`${origin}${url}`, {method: 'DELETE'}).then(async res => res.json()),
};
