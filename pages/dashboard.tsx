import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@/layouts/main';
import PuzzleSetMap from '@/components/dashboard/puzzle-set-map';

import useUser from '@/hooks/use-user';

import {fetcher} from '@/lib/fetcher';

import {AchievementItem} from '@/models/user-model';

import Modal from '@/components/modal-achievement';

const DashbaordPage = () => {
	const [showModal, setShowModal] = useState(false);
	const user = useUser()?.data;
	const [achievementsList, setAchievementsList] = useState<AchievementItem[]>(
		[],
	);

	useEffect(() => {
		if (!user) return;
		const list = user.validatedAchievements.filter(
			achievement => !achievement.claimed,
		);

		setAchievementsList(() => list);
		if (list.length > 0) setShowModal(() => true);
	}, [user]);

	// TODO: check achievements order
	const updateValidatedAchievement = async (achievementId: string) => {
		setShowModal(() => false);
		await fetcher.put(`/api/achievement`, {achievementId, claimed: true});
		const list = achievementsList.filter(item => item.id !== achievementId);
		if (list.length > 0) setShowModal(() => true);
		setAchievementsList(() => list);
	};

	return (
		<>
			<Modal
				showModal={showModal}
				currentAchievementItem={achievementsList[0]}
				handleClick={updateValidatedAchievement}
			/>
			<div className=' flex min-h-screen flex-col items-center justify-center text-slate-800'>
				<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white sm:text-4xl md:text-5xl'>
					Here are your sets!
				</h1>
				<p className='text-md w-11/12 text-gray-100 sm:text-2xl '>
					Solve the same puzzles again and again, only faster. It’s not a lazy
					shortcut to success – hard work is required. But the reward can be
					re-programming your unconscious mind. Benefits include sharper
					tactical vision, fewer blunders, better play when in time trouble and
					improved intuition.
				</p>
				<PuzzleSetMap />
			</div>
		</>
	);
};

DashbaordPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default DashbaordPage;
