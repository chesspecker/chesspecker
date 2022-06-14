import useSWR from 'swr';
import type {UserData} from '@/pages/api/user';

const fetcher = async (endpoint: string): Promise<UserData> =>
	fetch(endpoint).then(async response => response.json() as Promise<UserData>);
const useUser = () => {
	const {data, mutate} = useSWR('/api/user', fetcher);
	if (data?.success) {
		return {
			user: data.data,
			mutate,
		};
	}
};

export default useUser;
