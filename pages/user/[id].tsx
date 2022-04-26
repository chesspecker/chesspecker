import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@/layouts/main';
import {ButtonLink} from '@/components/button';
import {fetcher} from '@/lib/fetcher';
import Card from '@/components/card-achievement';
import {Data as UserData} from '@/api/user/[id]';
import {achievements} from '@/data/achievements';
import type {AchievementInterface, UserInterface} from '@/models/types';

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
		<div className='mt-32 flex min-h-screen w-screen flex-col px-10 text-slate-800'>
			<div className='flex items-center flex-wrap'>
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
				<div className='w-full flex items-center justify-center'>
					<div className='flex justify-center items-center w-full max-w-screen-xl'>
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
			<div className='flex w-1/3'></div>
		</div>
	);
};

Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Profile;

interface SSRProps {
	params: {id: string | undefined};
}

export const getServerSideProps = async ({params}: SSRProps) => {
	const id: string = params.id;
	const data = (await fetcher.get(`/api/user/${id}`)) as UserData;
	console.log('user', data);
	if (!data.success) return {notFound: true};
	return {props: {user: data.user}};
};
