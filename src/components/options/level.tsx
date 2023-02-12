import type {Difficulty} from '@prisma/client';
import {useSetAtom} from 'jotai';
import type {ChangeEvent} from 'react';
import {safeZero} from '@/utils/safe-zero';
import {optionsLevelAtom} from '@/atoms/options';
import {api} from '@/utils/api';

export const OptionLevel = () => {
	const setLevel = useSetAtom(optionsLevelAtom);
	const {data} = api.rating.get.useQuery();
	const rating = data ?? 1500;

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setLevel(() => event.target.value as Difficulty);
	};

	return (
		<div className='my-8 flex w-full flex-col items-stretch justify-between text-left'>
			<div className='flex flex-col justify-between md:flex-row'>
				<label htmlFor='number_game' className='m-0 mr-4 self-center text-2xl '>
					Difficulty level
				</label>
				<div className='mx-auto mt-2 h-12 w-4/6 md:mx-0 md:mt-0 md:w-2/6'>
					<select
						id='puzzle-difficulty'
						name='difficulty'
						defaultValue='normal'
						className='m-0 box-border block h-10 w-full appearance-none rounded-md bg-white bg-no-repeat py-1 text-base font-semibold text-stone-700 shadow-lg hover:border-neutral-500 focus:outline-none focus-visible:border-stone-400 sm:text-sm'
						onChange={handleChange}
					>
						<option value='easiest' title='600 points below your puzzle rating'>
							Easiest (&#8776;{safeZero(rating - 600)})
						</option>
						<option value='easier' title='300 points below your puzzle rating'>
							Easier (&#8776;{safeZero(rating - 300)})
						</option>
						<option value='normal'>Normal (&#8776;{rating})</option>
						<option value='harder' title='300 points above your puzzle rating'>
							Harder (&#8776;{rating + 300})
						</option>
						<option value='hardest' title='600 points above your puzzle rating'>
							Hardest (&#8776;{rating + 600})
						</option>
					</select>
				</div>
			</div>
		</div>
	);
};
