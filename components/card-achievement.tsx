import Image from 'next/image';
import {AchievementInterface} from '@/models/types';

const Card = ({achievement}: {achievement: AchievementInterface}) => {
	return (
		<div className=' m-2 flex h-96 w-64 flex-col rounded-lg border border-white bg-white p-2 '>
			<div className=' relative flex h-1/2 w-full items-center justify-center rounded-lg bg-sky-700'>
				<Image src={achievement.image} layout='fill' objectFit='contain' />
			</div>
			<div className=' flex h-1/2 w-full flex-col   '>
				<h4 className='mt-2 text-xl font-bold'>{achievement?.name}</h4>
				<p className='mt-2 text-black'>{achievement?.description}</p>
			</div>
		</div>
	);
};

export default Card;
