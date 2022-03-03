import {useAtom} from 'jotai';
import {ChangeEvent} from 'react';
import {optionsLevelAtom, ratingAtom} from '@/lib/atoms';
import {Difficulty} from '@/models/puzzle-set-model';
import useEffectAsync from '@/hooks/use-effect-async';
import {fetcher} from '@/lib/fetcher';
import {Data} from '@/pages/api/rating';
import {safeZero} from '@/lib/utils';

const OptionLevel = () => {
	const [, setLevel] = useAtom(optionsLevelAtom);
	const [rating, setRating] = useAtom(ratingAtom);
	useEffectAsync(async () => {
		const response: Data = (await fetcher.get('/api/rating')) as Data;
		if (!response.success) return;
		setRating(response.rating);
	}, []);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setLevel(() => event.target.value as Difficulty);
	};

	return (
		<div className='mt-8 flex w-full flex-col items-stretch justify-between text-left'>
			<div className='flex justify-between'>
				<label
					htmlFor='number_game'
					className='m-0 mr-4 self-center text-3xl text-white'
				>
					Difficulty level
				</label>
				<div className='w-2/3'>
					<select
						id='puzzle-difficulty'
						name='difficulty'
						defaultValue='normal'
						className='m-0 box-border block w-full max-w-full appearance-none bg-white bg-no-repeat text-2xl font-semibold text-stone-700 hover:border-neutral-500 focus-visible:border-stone-400'
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
			<p className='text-2xl text-white'>
				Difficulty is based on your average Lichess rating
			</p>
		</div>
	);
};

export default OptionLevel;
