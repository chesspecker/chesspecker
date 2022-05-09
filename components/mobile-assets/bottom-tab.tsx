import {UserIcon, HomeIcon, LightningBoltIcon} from '@heroicons/react/solid';
import Link from 'next/link';

const BottomTab = () => (
	<div className='dark:bg-white bg-slate-900 fixed bottom-0 safe-bottom pt-2 min-h-[4rem] w-full sm:hidden flex justify-around items-center'>
		<Link href='/achievements'>
			<a>
				<div className='border-b-2 dark:border-white border-slate-900 hover:dark:border-sky-700 hover:border-white focus:dark:border-sky-700 focus:border-white'>
					<LightningBoltIcon
						className='w-8 h-8 dark:text-sky-700 text-white'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>

		<Link href='/dashboard'>
			<a>
				<div className='border-b-2 dark:border-white border-slate-900 hover:dark:border-sky-700 hover:border-white focus:dark:border-sky-700 focus:border-white'>
					<HomeIcon
						className='w-8 h-8 dark:text-sky-700 text-white'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>
		<Link href='/user'>
			<a>
				<div className='border-b-2 dark:border-white border-slate-900 hover:dark:border-sky-700 hover:border-white focus:dark:border-sky-700 focus:border-white'>
					<UserIcon
						className='w-8 h-8 dark:text-sky-700 text-white'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>
	</div>
);

export default BottomTab;
