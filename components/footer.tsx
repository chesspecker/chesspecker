import Image from 'next/image.js';
import Link from 'next/link';
import {HeartIcon} from '@heroicons/react/solid';
import github from '@/public/images/github.svg';
import discord from '@/public/images/discord.svg';

const Footer = () => (
	<footer className='flex h-24 w-full flex-row items-center justify-center bg-slate-900 shadow'>
		<div className='flex w-full content-center justify-between '>
			<div className='mx-5 flex flex-col items-center justify-center '>
				{/* TODO: add link to sponsor page */}
				<Link href='https://github.com/sponsors/chesspecker'>
					<a>
						<div className=' flex w-full cursor-pointer content-center items-center justify-between px-3 '>
							<HeartIcon className='h-6 w-6 text-white' />
							<p className='ml-3 cursor-pointer text-xl text-white'>Support</p>
						</div>
					</a>
				</Link>
			</div>
			<div className='mx-5 flex flex-row '>
				<Link href='https://github.com/chesspecker'>
					<a>
						<div className=' flex w-full cursor-pointer content-center items-center justify-between px-3 '>
							{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
							<Image src={github} width={30} height={30} />
							<p className='ml-3 cursor-pointer border-solid text-xl text-white'>
								Github
							</p>
						</div>
					</a>
				</Link>
				<Link href='https://discord.gg/AaaAuUZK'>
					<a>
						<div className=' flex w-full cursor-pointer content-center  items-center justify-between px-3  '>
							{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
							<Image src={discord} width={25} height={25} />
							<p className='ml-3 cursor-pointer border-solid text-xl text-white'>
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
