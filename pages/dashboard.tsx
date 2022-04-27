import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {GetServerSidePropsContext, Redirect} from 'next';
import Layout from '@/layouts/main';
import PuzzleSetMap from '@/components/dashboard/puzzle-set-map';
import useUser from '@/hooks/use-user';
import {AchievementItem, AchivementsArgs, UserInterface} from '@/types/models';
import Modal from '@/components/modal-achievement';
import {checkForAchievement} from '@/lib/achievements';
import useEffectAsync from '@/hooks/use-effect-async';
import {withSessionSsr} from '@/lib/session';
import {formattedDate} from '@/lib/utils';

const DashbaordPage = () => {
	const [showModal, setShowModal] = useState(false);
	const data = useUser();
	const [user, setUser] = useState<UserInterface>();
	const [achievementsList, setAchievementsList] = useState<AchievementItem[]>(
		[],
	);

	const today = new Date();
	const currentDate = formattedDate(today);

	const body: AchivementsArgs = {
		streakMistakes: 0,
		streakTime: 0,
		completionTime: 0,
		completionMistakes: 0,
		totalPuzzleSolved: 0,
		themes: [],
		totalSetSolved: 0,
		// FIXME: incorrect type
		streak: {
			currentCount: 0,
			startDate: currentDate, // 11/11/2019
			lastLoginDate: currentDate, // 14/11/2019
		},
		isSponsor: user?.isSponsor,
	};

	useEffectAsync(async () => {
		if (!data) return;
		setUser(data.user);
		await checkForAchievement(body);
	}, [data, body]);

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
		await fetch(`/api/achievement`, {
			method: 'PUT',
			body: JSON.stringify({achievementId, claimed: true}),
		});
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
			<div className=' flex min-h-screen flex-col items-center  justify-center pb-20 pt-24 text-slate-800'>
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

export const getServerSideProps = withSessionSsr(
	async ({req}: GetServerSidePropsContext) => {
		if (!req?.session?.userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		return {props: {}};
	},
);
