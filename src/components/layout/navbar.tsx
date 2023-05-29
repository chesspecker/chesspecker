import Link from 'next/link';
import Image from 'next/image';

export const Navbar = () => (
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
					<p className='ml-1 mr-4 hidden self-center sm:block md:text-lg text-white font-bold'>
						— Chesspecker
					</p>
				</div>
			</Link>
		</div>
	</div>
);
