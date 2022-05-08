import {UserIcon, HomeIcon, LightningBoltIcon} from '@heroicons/react/solid';
import Link from 'next/link';

const BottomTab = () => (
	<div className='bg-white fixed bottom-0 safe-bottom pt-2 min-h-[4rem] w-full sm:hidden flex justify-around items-center'>
		<Link href='/achievements'>
			<a>
				<div className='border-b-2 border-white hover:border-sky-700 focus:border-sky-700'>
					<LightningBoltIcon
						className='w-8 h-8 text-sky-700'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>

		<Link href='/dashboard'>
			<a>
				<div className='border-b-2 border-white hover:border-sky-700 focus:border-sky-700'>
					<HomeIcon className='w-8 h-8 text-sky-700' aria-hidden='true' />
				</div>
			</a>
		</Link>
		<Link href='/user'>
			<a>
				<div className='border-b-2 border-white hover:border-sky-700 focus:border-sky-700'>
					<UserIcon className='w-8 h-8 text-sky-700' aria-hidden='true' />
				</div>
			</a>
		</Link>
	</div>
);

export default BottomTab;
