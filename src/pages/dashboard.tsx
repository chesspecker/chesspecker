import type {ReactElement} from 'react';
import {useState} from 'react';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import type {User, PuzzleSet, AchievementItem} from '@prisma/client';
import {Layout} from '@/layouts/main';
import {withSessionSsr} from '@/lib/session';
import {PuzzleSetMap} from '@/components/dashboard/puzzle-set-map';
import {prisma} from '@/server/db';

const Modal = dynamic(async () =>
	import('@/components/modal-achievement').then(module => module.Modal),
);

type Props = {
	user: User & {
		puzzleSets: PuzzleSet[];
		validatedAchievements: AchievementItem[];
	};
};

const DashbaordPage = ({user}: Props) => {
	const [achievList, setAchievList] = useState<AchievementItem[]>(
		user?.validatedAchievements.filter(achievement => !achievement.claimed),
	);
	const [showModal, setShowModal] = useState(achievList?.length > 0);

	const updateValidatedAchievement = async (achievementId: string) => {
		setShowModal(() => false);
		await fetch('/api/achievement', {
			method: 'PUT',
			body: JSON.stringify({achievementId, claimed: true}),
		});
		const list = achievList.filter(item => item.id !== achievementId);
		if (list.length > 0) setShowModal(() => true);
		setAchievList(() => list);
	};

	return (
		<>
			<NextSeo title='♟ Dashboard' />
			<Modal
				showModal={showModal}
				currentAchievementItem={achievList?.[0]}
				handleClick={updateValidatedAchievement}
			/>
			<div className='relative flex min-h-screen flex-col items-center justify-center pt-12 pb-20 md:pt-24'>
				<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold sm:text-4xl md:text-5xl'>
					Here are your sets!
				</h1>

				<PuzzleSetMap puzzleSets={user?.puzzleSets} />
			</div>
		</>
	);
};

DashbaordPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default DashbaordPage;

export const getServerSideProps = withSessionSsr(
	async ({req}: GetServerSidePropsContext) => {
		const userId = req.session?.userId;
		const redirect: Redirect = {statusCode: 303, destination: '/'};
		if (!userId) return {redirect};

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				validatedAchievements: true,
				puzzleSets: true,
			},
		});

		if (!user) return {redirect};

		return {
			props: {
				user,
			},
		};
	},
);
