import type {ReactElement} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import type {AchievementItem, User} from '@prisma/client';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {Button} from '@/components/button';
import Card from '@/components/card-achievement';
import {achievements} from '@/data/achievements';
import {Layout} from '@/layouts/main';
import type {AchievementInterface} from '@/types/achievements';
import {withSessionSsr} from '@/lib/session';
import {prisma} from '@/server/db';

type Props = {
	user: User & {
		validatedAchievements: AchievementItem[];
	};
};

const UserPage = ({user}: Props) => {
	const badges = user?.validatedAchievements.map(item =>
		achievements.find(achievement => item.id === achievement.id),
	) as AchievementInterface[];

	return (
		<>
			<NextSeo title='♟ Profile' />
			<div className='flex min-h-screen w-screen flex-col px-10 pt-12 pb-24 md:pt-32'>
				<div className='flex flex-wrap items-center'>
					<p className='mr-5 mb-1 text-4xl md:text-6xl'>{user?.username}</p>
					{user?.isSponsor ? (
						<>
							<p className='mr-2'>Official Sponsor</p>
							<div>
								<Link href='/sponsor'>
									<Button>Manage subscription</Button>
								</Link>
							</div>
						</>
					) : (
						<Link href='/sponsor'>
							<Button>Become sponsor</Button>
						</Link>
					)}

					<div className='md:ml-2'>
						<Link href='/achievements'>
							<Button>See all achievements</Button>
						</Link>
					</div>
				</div>

				<div className='m-2 min-h-[5rem] md:mt-4'>
					<p className='text-xl'>My badges</p>
					<div className='flex w-full items-center justify-center'>
						<div className='flex w-full max-w-screen-xl items-center justify-center'>
							<div className='flex w-full flex-wrap items-center justify-center'>
								{badges?.length === 0 && (
									<p className='text-center'>
										You don&apos;t have any achievement yet
									</p>
								)}
								{badges?.length > 0 &&
									badges.map(achievement => (
										<Card key={achievement.id} achievement={achievement} />
									))}
							</div>
						</div>
					</div>
				</div>
				<div className='flex w-1/3' />
			</div>
		</>
	);
};

UserPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default UserPage;

export const getServerSideProps = withSessionSsr(
	async ({req}: GetServerSidePropsContext) => {
		const userId = req.session?.userId;
		const redirect: Redirect = {statusCode: 303, destination: '/'};
		if (!userId) return {redirect};

		const user = await prisma.user.findUnique({
			where: {id: userId},
			include: {validatedAchievements: true},
		});

		if (!user) return {redirect};

		return {
			props: {
				user,
			},
		};
	},
);
