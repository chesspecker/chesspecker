import useSWR from 'swr';
import type {Data} from '@/pages/api/user';

const fetcher = async (endpoint: string): Promise<Data> =>
	fetch(endpoint).then(async response => response.json() as Promise<Data>);
const useUser = () => {
	const {data, mutate} = useSWR('/api/user', fetcher);
	if (data?.success) {
		return {
			user: data.user,
			mutate,
		};
	}
};

export default useUser;
