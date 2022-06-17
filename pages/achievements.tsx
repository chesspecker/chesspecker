import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import Layout from '@/layouts/main';
import {achievements, achievementsCategorys} from '@/data/achievements';
import type {AchievementInterface} from '@/types/models';
import {User} from '@/models/user';
import useUser from '@/hooks/use-user';

const Card = dynamic(async () => import('@/components/card-achievement'));
const Achievements = () => {
	const data = useUser();
	const [user, setUser] = useState<User>();
	const [achievementsList, setList] = useState<AchievementInterface[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!data) return;
		setUser(data.user);
	}, [data]);

	useEffect(() => {
		if (!user) return;
		const validated = user.validatedAchievements;
		setList(() => {
			const array: AchievementInterface[] = [];
			for (const item of validated) {
				const result = achievements.find(
					achivement => achivement.id === item.id,
				);
				if (result) array.push();
			}

			return array;
		});

		setIsLoading(() => false);
	}, [user]);

	const checkIfWon = (achievement: AchievementInterface) =>
		achievementsList.some(achievement_ => achievement_.id === achievement?.id);

	if (isLoading) return null;
	return (
		<>
			<NextSeo title='♟ Achievements' />
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
									<div className='flex flex-wrap items-center justify-center max-w-5xl'>
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
		</>
	);
};

Achievements.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Achievements;
