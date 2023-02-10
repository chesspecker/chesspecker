import {UserIcon, HomeIcon, LightningBoltIcon} from '@heroicons/react/solid';
import Link from 'next/link';

const BottomTab = () => (
	<div className='fixed bottom-0 flex min-h-[4rem] w-full items-center justify-around bg-slate-900 pt-2 safe-bottom dark:bg-white sm:hidden'>
		<Link href='/achievements'>
			<a>
				<div className='border-b-4 border-slate-900 hover:border-white focus:border-white dark:border-white hover:dark:border-sky-700 focus:dark:border-sky-700'>
					<LightningBoltIcon
						className='h-8 w-8 text-white dark:text-sky-700'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>
		<Link href='/dashboard'>
			<a>
				<div className='border-b-4 border-slate-900 hover:border-white focus:border-white dark:border-white hover:dark:border-sky-700 focus:dark:border-sky-700'>
					<HomeIcon
						className='h-8 w-8 text-white dark:text-sky-700'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>
		<Link href='/user'>
			<a>
				<div className='border-b-4 border-slate-900 hover:border-white focus:border-white dark:border-white hover:dark:border-sky-700 focus:dark:border-sky-700'>
					<UserIcon
						className='h-8 w-8 text-white dark:text-sky-700'
						aria-hidden='true'
					/>
				</div>
			</a>
		</Link>
	</div>
);

export default BottomTab;
