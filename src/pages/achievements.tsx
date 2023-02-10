import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import Layout from '@/layouts/main';
import type {User} from '@/models/user';
import {getUser} from '@/lib/api-helpers';
import useEffectAsync from '@/hooks/use-effect-async';
import type {AchievementInterface} from '@/types/models';
import {achievements, achievementsCategorys} from '@/data/achievements';

const Card = dynamic(async () => import('@/components/card-achievement'));
const Achievements = () => {
	const [user, setUser] = useState<User>();
	const [achievList, setAchievList] = useState<AchievementInterface[]>([]);

	useEffectAsync(async () => {
		const response = await getUser();
		if (response.success) setUser(() => response.data);
	}, []);

	useEffect(() => {
		if (!user) return;
		setAchievList(
			() =>
				user.validatedAchievements.map(item =>
					achievements.find(achivement => achivement.id === item.id),
				) as AchievementInterface[],
		);
	}, [user]);

	const checkIfWon = (achievement: AchievementInterface) =>
		achievList.some(achievement_ => achievement_.id === achievement?.id);

	return (
		<>
			<NextSeo title='♟ Achievements' />
			<div className='flex min-h-screen flex-col items-center justify-center pt-12 pb-24 md:pt-32'>
				<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold sm:text-4xl md:text-5xl'>
					Achievements
				</h1>
				{achievementsCategorys.map(category => (
					<div key={category.name as React.Key}>
						<h1 className='mx-auto mt-8 px-5 text-center font-sans text-xl font-bold sm:text-2xl md:text-3xl'>
							{category.name}
						</h1>
						<h2 className='mx-auto mb-6 p-5 text-center font-sans text-lg font-bold sm:text-lg md:text-xl'>
							{category.description}
						</h2>
						<div className='flex w-full items-center justify-center'>
							<div className='flex w-full max-w-screen-xl items-center justify-center'>
								<div className='flex max-w-5xl flex-wrap items-center justify-center'>
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
				))}
			</div>
		</>
	);
};

Achievements.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Achievements;
