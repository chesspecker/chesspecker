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
		<div className='flex flex-col items-center justify-center min-h-screen pt-32 pb-24'>
			<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center sm:text-4xl md:text-5xl'>
				Achievements
			</h1>
			{achievementsCategorys.map(category => {
				return (
					<div key={category.name as React.Key}>
						<h1 className='px-5 mx-auto mt-8 font-sans text-xl font-bold text-center sm:text-2xl md:text-3xl'>
							{category.name}
						</h1>
						<h2 className='p-5 mx-auto mb-6 font-sans text-lg font-bold text-center sm:text-lg md:text-xl'>
							{category.description}
						</h2>
						<div className='flex items-center justify-center w-full'>
							<div className='flex items-center justify-center w-full max-w-screen-xl'>
								<div className='flex flex-wrap items-center justify-center w-full'>
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
