import Image from 'next/image';
import Link from 'next/link';
import {Burger} from '@/components/mobile/burger';
import {api} from '@/utils/api';

export const Navbar = () => {
	const {data: user} = api.user.getCurrent.useQuery();
	return (
		<>
			<Burger />
			<div className='fixed top-0 z-10 hidden h-16 w-full items-center justify-between bg-sky-700 font-sans shadow sm:visible sm:flex'>
				<div className='flex cursor-pointer'>
					<Link href='/dashboard'>
						<div className='flex'>
							<div className='relative m-2 h-12 w-12'>
								<Image
									fill
									src='/images/logo.svg'
									alt='logo'
									className='object-contain'
								/>
							</div>
							<p className='ml-1 mr-4 hidden self-center sm:block md:text-lg'>
								— Chesspecker
							</p>
						</div>
					</Link>
				</div>
				<div className='mr-8 self-center text-lg '>
					<div className='flex'>
						<Link href='/user'>
							<p className='mr-5 flex items-center justify-center'>
								{user?.isSponsor && (
									<span role='img' aria-label='crown'>
										👑 &nbsp;
									</span>
								)}
								{user?.username}
							</p>
						</Link>

						<Link href='/api/auth/logout'>
							<p className='flex'>logout</p>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};
