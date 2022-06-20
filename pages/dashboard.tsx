import type {ReactElement} from 'react';
import {useState} from 'react';
import {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import {useAtom} from 'jotai';
import dynamic from 'next/dynamic';
import {UserData} from './api/user/[id]';
import Layout from '@/layouts/main';
import {User} from '@/models/user';
import {withSessionSsr} from '@/lib/session';
import {Banner} from '@/components/dashboard/banner';
import {supportBannerµ} from '@/lib/atoms';
import {AchievementItem} from '@/models/achievement';
import {fetcher} from '@/lib/utils';

const Modal = dynamic(async () => import('@/components/modal-achievement'));
const PuzzleSetMap = dynamic(
	async () => import('@/components/dashboard/puzzle-set-map'),
);

type Props = {
	user: User;
};

const DashbaordPage = ({user}: Props) => {
	const [achievementsList, setList] = useState<AchievementItem[]>(
		user.validatedAchievements.filter(achievement => !achievement.claimed),
	);
	const [showModal, setShowModal] = useState(achievementsList.length > 0);
	const [isVisible, setIsVisible] = useAtom(supportBannerµ);

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
				{!user.isSponsor && isVisible && (
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
		const userID = req.session?.userID;
		const redirect: Redirect = {statusCode: 303, destination: '/'};
		if (!userID) return {redirect};

		const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
		const baseUrl = req ? `${protocol}://${req.headers.host!}` : '';
		const response = await fetcher<UserData>(`${baseUrl}/api/user/${userID}`);
		if (!response?.success) return {redirect};

		return {
			props: {
				user: response.data,
			},
		};
	},
);
