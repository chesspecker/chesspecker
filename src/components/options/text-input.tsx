import {useAtom} from 'jotai';
import type {ChangeEvent} from 'react';
import {optionsµ} from '@/lib/atoms';

declare type Props = {
	children: React.ReactNode;
};

const OptionTextInput = ({children}: Props) => {
	const [title, setTitle] = useAtom(optionsµ.title);
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(() => event.target.value);
	};

	return (
		<div className='my-8 flex w-full flex-col items-center justify-between overflow-hidden pb-4 text-left md:flex-row'>
			<label htmlFor='number_game' className='m-0 mr-4 self-center text-2xl '>
				{children}
			</label>
			<input
				id='title'
				className='m-0 mt-2 box-border block h-10 w-1/2 appearance-none rounded-md bg-white bg-no-repeat py-1 text-base font-semibold text-stone-700 shadow-lg hover:border-neutral-500 focus:outline-none focus-visible:border-stone-400 sm:text-sm md:mt-0'
				type='text'
				value={title}
				placeholder='ex: Road to 2300 elo :)'
				onChange={handleChange}
			/>
		</div>
	);
};

export default OptionTextInput;
