import Image from 'next/image.js';
import Link from 'next/link';
import github from '@/public/images/github.svg';

const Footer = () => (
	<footer className='flex h-20 w-full flex-row items-center justify-center bg-slate-900 shadow'>
		<div className='flex content-center justify-between '>
			<Link href='https://www.buymeacoffee.com/chessPecker'>
				<div className='flex items-center justify-center'>
					<p className='order-white cursor-pointer border-b-2 border-solid border-white pb-6 text-xl text-white'>
						Buy us coffee
					</p>
				</div>
			</Link>
			<Link href='https://github.com/chesspecker'>
				<div className='mr-20 flex content-center justify-center'>
					<p className='order-white cursor-pointer border-b-2 border-solid border-white pb-6 text-xl text-white'>
						Bug report or ideas? 💡
					</p>
					<Image src={github} width={50} height={50} />
				</div>
			</Link>
		</div>
	</footer>
);

export default Footer;
