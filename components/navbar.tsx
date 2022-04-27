import Image from 'next/image.js';
import Link from 'next/link';
import {LogoutIcon} from '@heroicons/react/solid';
import {useState, useEffect} from 'react';
import Burger from './mobile-assets/burger';
import logo from '@/public/images/logo.svg';
import useUser from '@/hooks/use-user';
import {UserInterface} from '@/types/models';

const Navbar = () => {
	const [user, setUser] = useState<UserInterface>();
	const data = useUser();

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);

	return (
		<>
			<Burger user={user} />
			<div className='fixed top-0 z-10 sm:flex w-full items-center justify-between bg-sky-700 font-merriweather shadow hidden sm:visible'>
				<div className='flex cursor-pointer'>
					<Link passHref href='/dashboard'>
						<a>
							<div className='flex'>
								<div className='m-2 max-w-[3.5rem]'>
									{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
									<Image src={logo} />
								</div>
								<p className='ml-1 mr-4 hidden self-center text-sm text-white sm:block md:text-lg'>
									— Chesspecker
								</p>
							</div>
						</a>
					</Link>
				</div>
				<div className='mr-8 self-center text-lg text-white'>
					<div className='flex'>
						<Link passHref href={`/user/${user?._id.toString()}`}>
							<a className='mr-5 flex items-center justify-center'>
								{user?.username}
								{user?.isSponsor && <span>&nbsp;👑</span>}
							</a>
						</Link>
						<Link passHref href='/api/auth/logout'>
							<a className='flex'>
								<LogoutIcon className='mr-2 mt-1 h-3 w-3 text-white md:h-5 md:w-5' />
								Logout
							</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
