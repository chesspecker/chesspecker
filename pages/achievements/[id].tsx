import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@/layouts/main';
import {fetcher} from '@/lib/fetcher';
import Card from '@/components/card-achievement';
import {Data as UserData} from '@/api/user/[id]';
import {achievements} from '@/data/achievements';
import type {AchievementInterface, UserInterface} from '@/models/types';
import {achievementsCategorys} from '@/data/achievements';

type Props = {
	user: UserInterface;
};

const Achievements = ({user}: Props) => {
	const itemAchievements = user.validatedAchievements;
	const [userAchievements, setUserAchievement] =
		useState<AchievementInterface[]>();
	console.log(userAchievements);
	useEffect(() => {
		if (!itemAchievements) return;
		const array = [];
		for (const item of itemAchievements) {
			array.push(achievements.find(achivement => achivement.id === item.id));
		}

		const userAchievements_ = array;
		setUserAchievement(userAchievements_);
	}, [itemAchievements]);

	const checkIfWon = (achievement: AchievementInterface) => {
		const isWon = userAchievements?.find(
			achievement_ => achievement_.id === achievement?.id,
		);
		console.log(isWon);
		if (isWon) return true;
		return false;
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white sm:text-4xl md:text-5xl'>
				Achievements
			</h1>
			{achievementsCategorys.map(category => {
				return (
					<div>
						<h1 className='mx-auto mt-8  px-5 text-center font-merriweather text-xl font-bold text-white sm:text-2xl md:text-3xl'>
							{category.name}
						</h1>
						<h2 className='mx-auto  mb-6 p-5 text-center font-merriweather text-lg font-bold text-white sm:text-lg md:text-xl'>
							{category.description}
						</h2>
						<div className='flex justify-center items-center w-full max-w-screen-xl'>
							<div className=' w-full  justify-center flex flex-wrap'>
								{achievements.map(
									achievement =>
										achievement.category === category.name && (
											<Card
												achievement={achievement}
												isClaimed={checkIfWon(achievement)}
											/>
										),
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

Achievements.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Achievements;

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
