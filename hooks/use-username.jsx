import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());
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
