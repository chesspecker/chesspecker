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
		<div className='flex flex-col items-center justify-between w-full pb-4 my-8 overflow-hidden text-left md:flex-row'>
			<label
				htmlFor='number_game'
				className='self-center m-0 mr-4 text-2xl text-white'
			>
				{children}
			</label>
			<input
				id='title'
				className='box-border block w-1/2 h-10 py-1 m-0 mt-2 text-base font-semibold bg-white bg-no-repeat rounded-md shadow-lg appearance-none text-stone-700 hover:border-neutral-500 focus:outline-none focus-visible:border-stone-400 sm:text-sm md:mt-0'
				type='text'
				value={title}
				placeholder='ex: Road to 2300 elo :)'
				onChange={handleChange}
			/>
		</div>
	);
};

export default OptionTextInput;
