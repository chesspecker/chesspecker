import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@/layouts/main';
import {ButtonLink} from '@/components/button';
import Card from '@/components/card-achievement';
import {achievements} from '@/data/achievements';
import type {AchievementInterface, UserInterface} from '@/types/models';
import useUser from '@/hooks/use-user';

const User = () => {
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

	if (isLoading) return null;
	return (
		<div className='flex flex-col w-screen min-h-screen px-10 pt-32 pb-24 text-slate-800'>
			<div className='flex flex-wrap items-center'>
				<p className='mr-5 text-6xl text-white '>{user.username}</p>
				{user?.isSponsor ? (
					<p className='text-white'>Official Sponsor</p>
				) : (
					<ButtonLink href='/sponsor'>Become sponsor </ButtonLink>
				)}
				<div className='m-2'>
					<ButtonLink href='/sponsor'>Manage subscription</ButtonLink>
				</div>
				<div className='m-2'>
					<ButtonLink href='/achievements'>See all achievements</ButtonLink>
				</div>
			</div>

			<div className='borded-white m-2 mt-6 min-h-[5rem] rounded-xl border p-2'>
				<p className='text-xl text-white'>My badges</p>
				<div className='flex items-center justify-center w-full'>
					<div className='flex items-center justify-center w-full max-w-screen-xl'>
						<div className='flex flex-wrap items-center justify-center w-full'>
							{achievementsList.length === 0 && (
								<p className='text-center text-white'>
									You don&apos;t have any achievement yet
								</p>
							)}
							{achievementsList.length > 0 &&
								achievementsList.map(achievement => (
									<Card key={achievement.id} achievement={achievement} />
								))}
						</div>
					</div>
				</div>
			</div>
			<div className='flex w-1/3' />
		</div>
	);
};

User.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default User;
