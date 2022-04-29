import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {GetServerSidePropsContext} from 'next';
import Layout from '@/layouts/main';
import Card from '@/components/card-achievement';
import {Data as UserData} from '@/api/user/[id]';
import {achievements, achievementsCategorys} from '@/data/achievements';
import type {AchievementInterface, UserInterface} from '@/types/models';

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
		<div className='flex min-h-screen flex-col items-center justify-center pt-32 pb-24'>
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white sm:text-4xl md:text-5xl'>
				Achievements
			</h1>
			{achievementsCategorys.map(category => {
				return (
					<div key={category.name as React.Key}>
						<h1 className='mx-auto mt-8  px-5 text-center font-merriweather text-xl font-bold text-white sm:text-2xl md:text-3xl'>
							{category.name}
						</h1>
						<h2 className='mx-auto  mb-6 p-5 text-center font-merriweather text-lg font-bold text-white sm:text-lg md:text-xl'>
							{category.description}
						</h2>
						<div className='flex w-full items-center justify-center'>
							<div className='flex w-full max-w-screen-xl items-center justify-center'>
								<div className='flex w-full flex-wrap items-center justify-center'>
									{achievements.map(
										achievement =>
											achievement.category === category.name && (
												<Card
													key={achievement.id}
													achievement={achievement}
													isClaimed={checkIfWon(achievement)}
												/>
											),
									)}
								</div>
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
