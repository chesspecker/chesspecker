import {AchievementInterface} from '@/data/achievements';

const Card = ({achievement}: {achievement: AchievementInterface}) => {
	return (
		<div className=' m-2 flex h-96 w-64 flex-col rounded-lg border border-white bg-white p-2 '>
			<div className=' flex h-1/2 w-full items-center justify-center rounded-lg bg-sky-700'>
				<p className='text-9xl'>🐇</p>
			</div>
			<div className=' flex h-1/2 w-full flex-col   '>
				<h4 className='mt-2 text-xl font-bold'>{achievement?.name}</h4>
				<p className='mt-2 text-black'>{achievement?.description}</p>
			</div>
		</div>
	);
};

export default Card;
