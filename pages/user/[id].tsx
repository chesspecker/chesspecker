import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@/layouts/main';
import {ButtonLink} from '@/components/button';
import {fetcher} from '@/lib/fetcher';
import Card from '@/components/card-achievement';
import {Data as UserData} from '@/api/user/[id]';
import {achievements} from '@/data/achievements';
import type {AchievementInterface} from '@/models/types';

const Profile = ({user}) => {
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
		<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
			<ButtonLink href='sponsor'>Become sponsor </ButtonLink>
			<p>My badges</p>
			<div className='flex w-full flex-wrap'>
				{userAchievements &&
					userAchievements.map(achievement => (
						<div key={achievement.id}>
							<Card achievement={achievement} />
						</div>
					))}
			</div>
			<p>Dashboard settings</p>
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
