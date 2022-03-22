import type {ReactElement} from 'react';
import Layout from '@/layouts/main';
import PuzzleSetMap from '@/components/dashboard/puzzle-set-map';

const DashbaordPage = () => (
	<div className='-mb-24 flex min-h-screen flex-col items-center justify-center text-slate-800'>
		<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white sm:text-4xl md:text-5xl'>
			Here are your sets!
		</h1>
		<p className='text-md w-11/12 text-gray-100 sm:text-2xl '>
			Solve the same puzzles again and again, only faster. It’s not a lazy
			shortcut to success – hard work is required. But the reward can be
			re-programming your unconscious mind. Benefits include sharper tactical
			vision, fewer blunders, better play when in time trouble and improved
			intuition.
		</p>
		<PuzzleSetMap />
	</div>
);

DashbaordPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default DashbaordPage;
