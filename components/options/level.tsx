import {useAtom} from 'jotai';
import {ChangeEvent} from 'react';
import {optionsµ, ratingAtom} from '@/lib/atoms';
import useEffectAsync from '@/hooks/use-effect-async';
import {Data} from '@/pages/api/rating';
import {safeZero} from '@/lib/utils';
import type {Difficulty} from '@/types/models';

const OptionLevel = () => {
	const [, setLevel] = useAtom(optionsµ.level);
	const [rating, setRating] = useAtom(ratingAtom);
	useEffectAsync(async () => {
		const data = await fetch('/api/rating').then(
			async response => response.json() as Promise<Data>,
		);
		if (data.success) setRating(data.rating);
	}, []);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setLevel(() => event.target.value as Difficulty);
	};

	return (
		<div className='flex flex-col items-stretch justify-between w-full my-8 text-left'>
			<div className='flex flex-col justify-between md:flex-row'>
				<label htmlFor='number_game' className='self-center m-0 mr-4 text-2xl '>
					Difficulty level
				</label>
				<div className='w-4/6 h-12 mx-auto mt-2 md:mx-0 md:mt-0 md:w-2/6'>
					<select
						id='puzzle-difficulty'
						name='difficulty'
						defaultValue='normal'
						className='box-border block w-full h-10 py-1 m-0 text-base font-semibold bg-white bg-no-repeat rounded-md shadow-lg appearance-none text-stone-700 hover:border-neutral-500 focus:outline-none focus-visible:border-stone-400 sm:text-sm'
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

export default OptionLevel;
