import {useState, Fragment} from 'react';
import {Transition} from '@headlessui/react';
import type {AchievementItem} from '@prisma/client';
import {Button} from '@/components/button';
import Card from '@/components/card-achievement';
import {useEffectAsync} from '@/hooks/use-effect-async';
import {achievements as achievementsList} from '@/data/achievements';
import type {AchievementInterface} from '@/types/achievements';

type Props = {
	/* eslint-disable-next-line react/boolean-prop-naming */
	showModal: boolean;
	currentAchievementItem: AchievementItem;
	handleClick: (id: string) => void;
};

export const Modal = ({
	showModal,
	currentAchievementItem,
	handleClick,
}: Props): JSX.Element | null => {
	const [achievement, setAchievement] = useState<AchievementInterface>();
	useEffectAsync(() => {
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
			<div className='absolute z-40 -mt-10 flex min-h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-80'>
				<Transition.Child
					enter='transform transition duration-[400ms]'
					enterFrom='opacity-0 scale-0'
					enterTo='opacity-100 rotate-0 scale-100'
					leave='transform duration-200 transition ease-in-out'
					leaveFrom='opacity-100 rotate-0 scale-100'
					leaveTo='opacity-0 scale-95'
				>
					<h3 className='mb-5 text-center text-6xl font-bold text-white '>
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
				<div className='mt-4 w-1/3 text-white'>
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
