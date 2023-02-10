import Image from 'next/image';
import type {AchievementInterface} from '@/types/models';

const Card = ({
	achievement,
	isClaimed = true,
}: {
	achievement: AchievementInterface;
	isClaimed?: boolean;
}) => (
	<div
		className={`m-2 flex h-96 w-64 flex-col rounded-lg bg-sky-700 p-2 dark:bg-white ${
			isClaimed ? '' : 'grayscale'
		} relative overflow-hidden`}
	>
		{isClaimed ? (
			''
		) : (
			<div className='absolute top-0 left-0 z-20 h-full w-full bg-black opacity-50' />
		)}
		<div className='relative flex h-1/2 w-full items-center justify-center rounded-lg bg-white dark:bg-sky-700'>
			<Image src={achievement.image} layout='fill' objectFit='contain' />
		</div>
		<div className='flex h-1/2 w-full flex-col'>
			<h4 className='mt-2 text-xl font-bold text-white dark:text-sky-800'>
				{achievement?.name}
			</h4>
			<p className='mt-2 text-white dark:text-sky-900'>
				{achievement?.description}
			</p>
		</div>
	</div>
);

export default Card;
