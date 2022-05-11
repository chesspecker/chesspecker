import {memo, useState} from 'react';
import ProgressBar from '../progress-bar';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';
import useEffectAsync from '@/hooks/use-effect-async';

type Props = {
	onClick: () => Promise<void>;
	isOpen: boolean;
	hide: () => void;
};
const ModalSpacedOn = ({onClick, isOpen = false, hide}: Props) => {
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [timerId, setTimerId] = useState<NodeJS.Timeout>();

	const wrapOnClick = async () => {
		setIsLoading(true);
		setTimerId(() =>
			setInterval(() => {
				setProgress(previous => previous + 1);
			}, 150),
		);
	};

	useEffectAsync(async () => {
		if (!timerId) return;
		if (progress >= 95) {
			clearInterval(timerId);
			await onClick();
		}
	}, [progress, timerId]);

	return (
		<GenericModal
			title='Activate spaced repetition'
			hide={hide}
			isOpen={isOpen}
		>
			<div className='w-full mt-2'>
				<p className='text-sm text-gray-500'>
					Congrats on finishing the first step of your journey. <br />
					You can now choose to activate the spaced-repetition mode for this
					set. Instead of playing every puzzle, you will be facing the puzzle
					you had difficulties with.
				</p>
			</div>
			<div className='mt-4'>
				<div className='flex justify-start w-full'>
					{isLoading ? (
						<ProgressBar title='Loading...' progress={progress} />
					) : (
						<>
							<Button
								type='button'
								className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
								onClick={hide}
							>
								No thanks
							</Button>
							<Button
								type='button'
								className='inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
								onClick={wrapOnClick}
							>
								Activate
							</Button>
						</>
					)}
				</div>
			</div>
		</GenericModal>
	);
};

export default memo(ModalSpacedOn);
