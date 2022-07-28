import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import Layout from '@/layouts/main';
import {User} from '@/models/user';
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
			<div className='flex flex-col items-center justify-center min-h-screen pt-12 md:pt-32 pb-24'>
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
