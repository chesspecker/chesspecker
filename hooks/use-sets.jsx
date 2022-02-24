/* eslint-disable @typescript-eslint/naming-convention */
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(response => response.json());
const useSets = () => {
	const {data, mutate, error} = useSWR('/api/sets', fetcher);
	console.log('data', data, 'error', error);
	const loading = !data && !error;

	return {
		loading,
		data,
		mutate,
	};
};

export default useSets;
