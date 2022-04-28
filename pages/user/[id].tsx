import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import type {GetServerSidePropsContext} from 'next';
import Layout from '@/layouts/main';
import {ButtonLink} from '@/components/button';
import Card from '@/components/card-achievement';
import {Data as UserData} from '@/api/user/[id]';
import {achievements} from '@/data/achievements';
import type {AchievementInterface, UserInterface} from '@/types/models';

type Props = {
	user: UserInterface;
};

const Profile = ({user}: Props) => {
	const itemAchievements = user.validatedAchievements;
	const [userAchievements, setUserAchievement] =
		useState<AchievementInterface[]>();

	useEffect(() => {
		if (!itemAchievements) return;
		const array = [];
		for (const item of itemAchievements) {
			array.push(achievements.find(achivement => achivement.id === item.id));
		}

		const userAchievements_ = array;
		setUserAchievement(userAchievements_);
	}, [itemAchievements]);

	return (
		<div className='flex min-h-screen w-screen flex-col px-10 pt-32 pb-24 text-slate-800'>
			<div className='flex flex-wrap items-center'>
				<p className=' mr-5 text-6xl text-white'>{user.username}</p>
				{user?.isSponsor ? (
					<p className='text-white'>Official Sponsor</p>
				) : (
					<ButtonLink href='/sponsor'>Become sponsor </ButtonLink>
				)}
				<div className='m-2'>
					<ButtonLink href='/sponsor'>Manage subscription</ButtonLink>
				</div>
				<div className='m-2'>
					<ButtonLink href={`/achievements/${user?._id.toString()}`}>
						See all avalaible achievements
					</ButtonLink>
				</div>
			</div>

			<div className='borded-white m-2 mt-6 min-h-[5rem] rounded-xl border p-2'>
				<p className='text-xl text-white'>My badges</p>
				<div className='flex w-full items-center justify-center'>
					<div className='flex w-full max-w-screen-xl items-center justify-center'>
						<div className='flex w-full flex-wrap items-center justify-center'>
							{userAchievements && userAchievements.length === 0 && (
								<p className='text-center text-white'>
									You don&apos;t have any achievement yet
								</p>
							)}
							{userAchievements &&
								userAchievements.length > 0 &&
								userAchievements.map(achievement => (
									<Card key={achievement.id} achievement={achievement} />
								))}
						</div>
					</div>
				</div>
			</div>
			<div className='flex w-1/3' />
		</div>
	);
};

Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Profile;

interface SSRProps extends GetServerSidePropsContext {
	params: {id: string | undefined};
}

export const getServerSideProps = async ({req, params}: SSRProps) => {
	const id: string = params.id;
	const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
	const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
	const data = await fetch(`${baseUrl}/api/user/${id}`).then(
		async response => response.json() as Promise<UserData>,
	);
	if (!data.success) return {notFound: true};
	return {props: {user: data.user}};
};
