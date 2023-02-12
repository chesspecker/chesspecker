import Image from 'next/image.js';
import Link from 'next/link';
import {HeartIcon} from '@heroicons/react/24/solid';

export const Footer = () => (
	<footer className='hidden h-24 w-full flex-row items-center justify-center shadow dark:bg-slate-900 sm:visible sm:flex '>
		<div className='flex w-full content-center justify-between'>
			<div className='mx-1 flex flex-col items-center justify-center sm:mx-5'>
				<Link href='/sponsor'>
					<div className='group flex w-full cursor-pointer content-center items-center justify-between px-3'>
						<HeartIcon className='h-6 w-6 group-hover:text-pink-600' />
						<p className='ml-3 cursor-pointer text-xl group-hover:text-pink-600'>
							Support
						</p>
					</div>
				</Link>
			</div>
			<div className='mx-1 flex flex-row sm:mx-5 '>
				<Link href='https://github.com/chesspecker' target='_blank'>
					<div className='flex w-full cursor-pointer content-center items-center justify-between px-3'>
						<div className='hidden items-center justify-center rounded-lg bg-transparent p-1 md:flex '>
							<Image
								src='/images/github.svg'
								width={30}
								height={30}
								alt='github icon'
							/>
						</div>
						<p className='ml-3 cursor-pointer border-solid text-xl'>Github</p>
					</div>
				</Link>
				<Link href='https://discord.gg/qDftJZBBHa' target='_blank'>
					<div className='flex w-full cursor-pointer content-center items-center justify-between px-3'>
						<div className='hidden items-center justify-center rounded-lg bg-transparent p-1 md:flex'>
							<Image
								src='/images/discord.svg'
								width={30}
								height={30}
								className='hidden md:block'
								alt='discord icon'
							/>
						</div>
						<p className='ml-3 cursor-pointer border-solid text-xl'>Discord</p>
					</div>
				</Link>
			</div>
		</div>
	</footer>
);
