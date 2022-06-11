import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import {useAtom} from 'jotai';
import Layout from '@/layouts/main';
import PuzzleSetMap from '@/components/dashboard/puzzle-set-map';
import useUser from '@/hooks/use-user';
import {AchievementItem} from '@/types/models';
import {User} from '@/models/user';
import Modal from '@/components/modal-achievement';
import {withSessionSsr} from '@/lib/session';
import {Banner} from '@/components/dashboard/banner';
import {supportBannerµ} from '@/lib/atoms';

const DashbaordPage = () => {
	const [showModal, setShowModal] = useState(false);
	const data = useUser();
	const [user, setUser] = useState<User>();
	const [achievementsList, setList] = useState<AchievementItem[]>([]);
	const [isVisible, setIsVisible] = useAtom(supportBannerµ);

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
			<NextSeo title='♟ Dashboard' />
			<Modal
				showModal={showModal}
				currentAchievementItem={achievementsList[0]}
				handleClick={updateValidatedAchievement}
			/>
			<div className='flex flex-col items-center justify-center min-h-screen pt-24 pb-20 relative  '>
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center sm:text-4xl md:text-5xl'>
					Here are your sets!
				</h1>

				<PuzzleSetMap />
				{!user?.isSponsor && isVisible && (
					<Banner setIsVisible={setIsVisible}>We need your help!</Banner>
				)}
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
