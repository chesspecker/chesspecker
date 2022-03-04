import {useAtom} from 'jotai';
import type {ChangeEvent} from 'react';
import {optionsTitleAtom} from '@/lib/atoms';

declare type Props = {
	children: React.ReactNode;
};

const OptionTextInput = ({children}: Props) => {
	const [title, setTitle] = useAtom(optionsTitleAtom);
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(() => event.target.value);
	};

	return (
		<div className='mt-8 flex w-full items-center justify-between overflow-hidden pb-4 text-left'>
			<label
				htmlFor='number_game'
				className='m-0 mr-4 self-center text-3xl text-white'
			>
				{children}
			</label>
			<input
				id='title'
				className='text-2xl'
				type='text'
				value={title}
				placeholder='ex: Road to 2300 elo :)'
				onChange={handleChange}
			/>
		</div>
	);
};

export default OptionTextInput;
