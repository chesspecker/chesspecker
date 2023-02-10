import type {ReactElement} from 'react';
import {useState, useEffect} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import Card from '@/components/card-achievement';
import type {User} from '@/models/user';
import useEffectAsync from '@/hooks/use-effect-async';
import {getUser} from '@/lib/api-helpers';
import type {AchievementInterface} from '@/types/models';
import {achievements} from '@/data/achievements';

const UserPage = () => {
	const [achievList, setAchievList] = useState<AchievementInterface[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User>();

	useEffectAsync(async () => {
		const response = await getUser();
		if (response.success) setUser(() => response.data);
	}, []);

	useEffect(() => {
		if (!user) return;

		const badges = user.validatedAchievements.map(item =>
			achievements.find(achievement => item.id === achievement.id),
		) as AchievementInterface[];

		setAchievList(() => badges);
		setIsLoading(() => false);
	}, [user]);

	return (
		<>
			<NextSeo title='♟ Profile' />
			<div className='flex min-h-screen w-screen flex-col px-10 pt-12 pb-24 md:pt-32'>
				<div className='flex flex-wrap items-center'>
					<p className='mr-5 mb-2 text-4xl md:text-6xl'>{user?.username}</p>
					{user?.isSponsor ? (
						<>
							<p className='mr-2'>Official Sponsor</p>
							<div>
								<Link href='/sponsor'>
									<a>
										<Button>Manage subscription</Button>
									</a>
								</Link>
							</div>
						</>
					) : (
						<Link href='/sponsor'>
							<a>
								<Button>Become sponsor</Button>
							</a>
						</Link>
					)}

					<div className='mt-2 md:ml-2'>
						<Link href='/achievements'>
							<a>
								<Button>See all achievements</Button>
							</a>
						</Link>
					</div>
				</div>

				<div className='m-2 min-h-[5rem] md:mt-4'>
					<p className='text-xl'>My badges</p>
					<div className='flex w-full items-center justify-center'>
						<div className='flex w-full max-w-screen-xl items-center justify-center'>
							{!isLoading && (
								<div className='flex w-full flex-wrap items-center justify-center'>
									{achievList.length === 0 && (
										<p className='text-center'>
											You don&apos;t have any achievement yet
										</p>
									)}
									{achievList.length > 0 &&
										achievList.map(achievement => (
											<Card key={achievement.id} achievement={achievement} />
										))}
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='flex w-1/3' />
			</div>
		</>
	);
};

UserPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default UserPage;
