import {useState, Fragment} from 'react';
import {Transition} from '@headlessui/react';
import useEffectAsync from '@/hooks/use-effect-async';
import {Button} from '@/components/button';
import Card from '@/components/card-achievement';
import {AchievementItem} from '@/models/achievement';
import {achievements as achievementsList} from '@/data/achievements';
import type {AchievementInterface} from '@/types/models';

type Props = {
	/* eslint-disable-next-line react/boolean-prop-naming */
	showModal: boolean;
	currentAchievementItem: AchievementItem;
	handleClick: (id: string) => void;
};

const Modal = ({
	showModal,
	currentAchievementItem,
	handleClick,
}: // eslint-disable-next-line @typescript-eslint/ban-types
Props): JSX.Element | null => {
	const [achievement, setAchievement] = useState<AchievementInterface>();
	useEffectAsync(async () => {
		if (!currentAchievementItem) return;
		const array = achievementsList.find(
			item => item.id === currentAchievementItem.id,
		);

		setAchievement(() => array);
	}, [currentAchievementItem]);

	if (!achievement) return null;
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
			<div className='absolute z-40 flex flex-col items-center justify-center w-screen min-h-screen -mt-10 bg-black bg-opacity-80'>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<h3 className='mb-5 text-6xl font-bold text-center text-white '>
						New achievement 🎉🔥
					</h3>
				</Transition.Child>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<Card achievement={achievement} />
				</Transition.Child>
				<div className='w-1/3 mt-4 text-white'>
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
