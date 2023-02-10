import Image from 'next/image.js';
import Link from 'next/link';
import {HeartIcon} from '@heroicons/react/solid';
import github from '@/public/images/github.svg';
import discord from '@/public/images/discord.svg';

const Footer = () => (
	<footer className='hidden h-24 w-full flex-row items-center justify-center shadow dark:bg-slate-900 sm:visible sm:flex '>
		<div className='flex w-full content-center justify-between'>
			<div className='mx-1 flex flex-col items-center justify-center sm:mx-5'>
				<Link href='/sponsor'>
					<a>
						<div className='group flex w-full cursor-pointer content-center items-center justify-between px-3'>
							<HeartIcon className='h-6 w-6 group-hover:text-pink-600' />
							<p className='ml-3 cursor-pointer text-xl group-hover:text-pink-600'>
								Support
							</p>
						</div>
					</a>
				</Link>
			</div>
			<div className='mx-1 flex flex-row sm:mx-5 '>
				<Link href='https://github.com/chesspecker'>
					<a target='_blank'>
						<div className='flex w-full cursor-pointer content-center items-center justify-between px-3'>
							<div className='hidden items-center justify-center rounded-lg bg-sky-800 p-1 dark:bg-transparent md:flex '>
								<Image src={github as string} width={30} height={30} />
							</div>
							<p className='ml-3 cursor-pointer border-solid text-xl'>Github</p>
						</div>
					</a>
				</Link>
				<Link href='https://discord.gg/qDftJZBBHa'>
					<a target='_blank'>
						<div className='flex w-full cursor-pointer content-center items-center justify-between px-3'>
							<div className='hidden items-center justify-center rounded-lg bg-sky-800 p-1 dark:bg-transparent md:flex'>
								<Image
									src={discord as string}
									width={30}
									height={30}
									className='hidden md:block'
								/>
							</div>
							<p className='ml-3 cursor-pointer border-solid text-xl'>
								Discord
							</p>
						</div>
					</a>
				</Link>
			</div>
		</div>
	</footer>
);

export default Footer;
