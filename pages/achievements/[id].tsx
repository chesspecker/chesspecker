import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@/layouts/main';
import Card from '@/components/card-achievement';
import {achievements, achievementsCategorys} from '@/data/achievements';
import type {AchievementInterface, UserInterface} from '@/types/models';
import useUser from '@/hooks/use-user';

const Achievements = () => {
	const data = useUser();
	const [user, setUser] = useState<UserInterface>();
	const [achievementsList, setList] = useState<AchievementInterface[]>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);

	useEffect(() => {
		if (!user) return;
		const itemAchievements = user.validatedAchievements;
		setList(() => {
			const array: AchievementInterface[] = [];
			for (const item of itemAchievements) {
				array.push(achievements.find(achivement => achivement.id === item.id));
			}

			return array;
		});

		setIsLoading(() => false);
	}, [user]);

	const checkIfWon = (achievement: AchievementInterface) =>
		achievementsList.some(achievement_ => achievement_.id === achievement?.id);

	if (isLoading) return null;
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
													key={achievement.name}
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
