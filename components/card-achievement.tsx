import Image from 'next/image';
import {AchievementInterface} from '@/types/models';

const Card = ({
	achievement,
	isClaimed = true,
}: {
	achievement: AchievementInterface;
	isClaimed?: boolean;
}) => {
	return (
		<div
			className={` m-2 flex h-96 w-64 flex-col rounded-lg border dark:border-white bg-sky-700 dark:bg-white p-2 ${
				!isClaimed && 'grayscale'
			} relative overflow-hidden`}
		>
			{!isClaimed && (
				<div className='absolute top-0 left-0 z-20 w-full h-full bg-black opacity-50' />
			)}
			<div className='relative flex items-center justify-center w-full rounded-lg h-1/2 bg-white dark:bg-sky-700'>
				<Image src={achievement.image} layout='fill' objectFit='contain' />
			</div>
			<div className='flex flex-col w-full h-1/2'>
				<h4 className='mt-2 text-xl font-bold dark:text-sky-800 text-white'>
					{achievement?.name}
				</h4>
				<p className='mt-2 dark:text-sky-900 text-white'>
					{achievement?.description}
				</p>
			</div>
		</div>
	);
};

export default Card;
