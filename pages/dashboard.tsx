import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {GetServerSidePropsContext, Redirect} from 'next';
import Layout from '@/layouts/main';
import PuzzleSetMap from '@/components/dashboard/puzzle-set-map';
import useUser from '@/hooks/use-user';
import {AchievementItem, UserInterface} from '@/types/models';
import Modal from '@/components/modal-achievement';
import {withSessionSsr} from '@/lib/session';

const DashbaordPage = () => {
	const [showModal, setShowModal] = useState(false);
	const data = useUser();
	const [user, setUser] = useState<UserInterface>();
	const [achievementsList, setList] = useState<AchievementItem[]>([]);

	useEffect(() => {
		if (!data) return;
		setUser(() => data.user);
	}, [data]);

	useEffect(() => {
		if (!user) return;
		const list = user.validatedAchievements.filter(
			achievement => !achievement.claimed,
		);

		setList(() => list);
		if (list.length > 0) setShowModal(() => true);
	}, [user]);

	const updateValidatedAchievement = async (achievementId: string) => {
		setShowModal(() => false);
		await fetch(`/api/achievement`, {
			method: 'PUT',
			body: JSON.stringify({achievementId, claimed: true}),
		});
		const list = achievementsList.filter(item => item.id !== achievementId);
		if (list.length > 0) setShowModal(() => true);
		setList(() => list);
	};

	return (
		<>
			<Modal
				showModal={showModal}
				currentAchievementItem={achievementsList[0]}
				handleClick={updateValidatedAchievement}
			/>
			<div className='flex flex-col items-center justify-center min-h-screen pt-24 pb-20 '>
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center sm:text-4xl md:text-5xl'>
					Here are your sets!
				</h1>
				<p className='w-11/12 text-md sm:text-xl '>
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
