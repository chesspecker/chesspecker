/* eslint-disable @typescript-eslint/naming-convention */
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(response => response.json());
const useUserName = () => {
	const {data, mutate, error} = useSWR('/api/user/name', fetcher, {
		initialData: {userName: 'Anonymous'},
	});
	const loading = !data && !error;

	return {
		loading,
		data,
		mutate,
	};
};

export default useUserName;
