import {useState, useEffect} from 'react';
import {UserIcon, HomeIcon, LightningBoltIcon} from '@heroicons/react/solid';
import Link from 'next/link';
import {UserInterface} from '@/types/models';
import useUser from '@/hooks/use-user';

const BottomTab = () => {
	const [user, setUser] = useState<UserInterface>();
	const data = useUser();

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);
	return (
		<div className='bg-white fixed bottom-0 safe-bottom pt-2 min-h-[4rem] w-full sm:hidden flex justify-around items-center'>
			<Link passHref href={`/achievements/${user?._id.toString()}`}>
				<div className='border-b-2 border-white hover:border-sky-700 focus:border-sky-700'>
					<LightningBoltIcon
						className='w-8 h-8 text-sky-700'
						aria-hidden='true'
					/>
				</div>
			</Link>

			<Link passHref href='/dashboard'>
				<div className='border-b-2 border-white hover:border-sky-700 focus:border-sky-700'>
					<HomeIcon className='w-8 h-8 text-sky-700' aria-hidden='true' />
				</div>
			</Link>
			<Link passHref href={`/user/${user?._id.toString()}`}>
				<div className='border-b-2 border-white hover:border-sky-700 focus:border-sky-700'>
					<UserIcon className='w-8 h-8 text-sky-700' aria-hidden='true' />
				</div>
			</Link>
		</div>
	);
};

export default BottomTab;
