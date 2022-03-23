import type {ReactElement} from 'react';
import Layout from '@/layouts/login';
import {ButtonLink} from '@/components/button';
import {fetcher} from '@/lib/fetcher';
import {useState, useEffect} from 'react';
import Card from '@/components/card-achievement';

import {Data as UserData} from '@/api/user/[id]';

import {achievements, AchievementInterface} from '@/data/achievements';

const Profile = ({user}) => {
	const itemAchievements = user.validatedAchievements;
	const [userAchievements, setUserAchievement] =
		useState<AchievementInterface[]>();

	useEffect(() => {
		if (!itemAchievements) return;
		let array = [];
		for (const item of itemAchievements) {
			console.log(item.name);
			array.push(
				achievements.filter(achivement => achivement.id === item.id)[0],
			);
		}

		const userAchievements_ = array;
		setUserAchievement(userAchievements_);
	}, [itemAchievements]);

	console.log(userAchievements);

	return (
		<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
			<ButtonLink href='sponsor'>Become sponsor </ButtonLink>
			<p>My badges</p>
			<div className='flex w-full flex-wrap'>
				{userAchievements.map(achievement => (
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
