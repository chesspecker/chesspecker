import Image from 'next/image.js';
import Link from 'next/link';
import github from '@/public/images/github.svg';

const Footer = () => (
	<footer className='flex h-10 w-full flex-row items-center justify-center bg-slate-900 shadow'>
		<div>
			<Link href='https://www.buymeacoffee.com/chessPecker'>
				<div className='flex content-center justify-center'>
					<p className='cursor-pointer border-b-2 border-white pb-3 text-base text-white'>
						Buy us coffee
					</p>
				</div>
			</Link>
			<Link href='https://github.com/chesspecker'>
				<div className='flex content-center justify-center'>
					<p className='mr-4 cursor-pointer border-b-2 border-white pb-3 text-base text-white'>
						Bug report or ideas? 💡
					</p>
					<Image src={github} width={50} height={50} />
				</div>
			</Link>
		</div>
	</footer>
);

export default Footer;
