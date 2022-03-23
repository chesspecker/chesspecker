import {useState, Fragment} from 'react';
import useEffectAsync from '../hooks/use-effect-async';
import {Button} from '@/components/button';
import {AchievementInterface} from '@/data/achievements';
import {achievements as arrayOfPossibleAchievement} from '@/data/achievements';
import {AchievementItem} from '@/models/user-model';
import {Transition} from '@headlessui/react';
import Card from '@/components/card-achievement';

const Modal = ({
	showModal,
	currentAchievementItem,
	handleClick,
}: {
	showModal: boolean;
	currentAchievementItem: AchievementItem;
	handleClick: (id: string) => void;
}): JSX.Element => {
	console.log('currentAchievementItem', currentAchievementItem);
	const [achievement, setAchievement] = useState<AchievementInterface>();
	useEffectAsync(async () => {
		if (!currentAchievementItem) return;
		const array = arrayOfPossibleAchievement.filter(
			item => item.id === currentAchievementItem.id,
		);

		/* 	const response = await fetcher.get(
			`/api/achievement/${currentAchievementItem.id}`,
		);
		setAchievement(response.data); */
		setAchievement(array[0]);
	}, [currentAchievementItem]);

	return (
		<Transition
			as={Fragment}
			show={showModal}
			enter='transform transition duration-[400ms]'
			enterFrom='opacity-0'
			enterTo='opacity-100'
			leave='transform duration-200 transition ease-in-out'
			leaveFrom='opacity-100'
			leaveTo='opacity-0'
		>
			<div className='absolute z-40 -mt-10 flex min-h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-80'>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100 '
					leaveTo='opacity-0 scale-95 '
				>
					<h3 className='mb-5 text-6xl font-bold text-white'>
						New achievement 🎉🔥
					</h3>
				</Transition.Child>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100 '
					leaveTo='opacity-0 scale-95 '
				>
					<Card achievement={achievement} />
				</Transition.Child>
				<div className='mt-4 w-1/3'>
					<Button
						onClick={() => {
							handleClick(currentAchievementItem.id);
						}}
					>
						Claim
					</Button>
				</div>
			</div>
		</Transition>
	);
};

export default Modal;
