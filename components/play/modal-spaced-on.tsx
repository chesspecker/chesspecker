import {memo, useState} from 'react';
import ProgressBar from '../progress-bar';
import {Button} from '@/components/button';
import GenericModal from '@/components/modal';

type Props = {
	onClick: (event?: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	isOpen: boolean;
	hide: (event?: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};
const ModalSpacedOn = ({onClick, hide, isOpen = false}: Props) => {
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const wrapOnClick = async (event?: React.MouseEvent<HTMLButtonElement>) => {
		setIsLoading(true);
		const timerId = setInterval(() => {
			setProgress(previous => previous + 1);
		}, 100);

		setTimeout(async () => {
			clearInterval(timerId);
			await onClick(event);
		}, 9500);
	};

	return (
		<GenericModal
			title='Activate spaced repetition'
			hide={hide}
			isOpen={isOpen}
		>
			<div className='w-full mt-2'>
				<p className='text-sm text-gray-500 leading-5'>
					Congrats on finishing the first step of your journey. You can now
					choose to activate the spaced-repetition mode for this set. Instead of
					playing every puzzle, you will be facing the puzzle you had
					difficulties with.
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
