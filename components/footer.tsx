import Image from 'next/image.js';
import Link from 'next/link';
import github from '@/public/images/github.svg';
import discord from '@/public/images/discord.svg';

const Footer = () => (
	<footer className='flex h-40 w-full flex-row items-center justify-center bg-slate-900 shadow'>
		<div className='flex w-full content-center justify-between '>
			<div className='mx-5 flex flex-col items-center justify-center '>
				{/* TODO: add link to sponsor page */}
				<Link href='#'>
					<div className=' flex w-full cursor-pointer content-center  items-center justify-between px-3 '>
						<p className='cursor-pointer border-b-2 border-solid  pb-2 pr-3 text-xl text-white'>
							Become official ChessPecker SPONSOR
						</p>
						{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
						<p className='text-3xl'>🔥</p>
					</div>
				</Link>
			</div>
			<div className='mx-5 flex flex-col '>
				<p className='order-white mb-3 cursor-pointer border-b-2 border-solid  pb-3 text-xl text-white'>
					Bug report or ideas? 💡
				</p>
				<Link href='https://github.com/chesspecker'>
					<div className=' flex w-full cursor-pointer content-center  items-center justify-between px-3 '>
						<p className='cursor-pointer border-solid pr-3   text-xl text-white'>
							Github
						</p>
						{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
						<Image src={github} width={40} height={40} />
					</div>
				</Link>
				<Link href='https://discord.gg/AaaAuUZK'>
					<div className=' flex w-full cursor-pointer content-center  items-center justify-between px-3  '>
						<p className='cursor-pointer border-solid pr-3   text-xl text-white'>
							Discord
						</p>
						{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
						<Image src={discord} width={40} height={40} />
					</div>
				</Link>
			</div>
		</div>
	</footer>
);

export default Footer;
