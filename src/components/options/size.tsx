import Slider from 'react-input-slider';
import {useAtom} from 'jotai';
import {optionsSizeAtom} from '@/atoms/options';

export const OptionSize = () => {
	const [size, setSize] = useAtom(optionsSizeAtom);
	const handleChange = (values: {x: number; y: number}) => {
		setSize(() => values.x);
	};

	return (
		<div className='my-8 flex w-full flex-col md:flex-row'>
			<div className='flex w-full flex-col justify-center md:flex-row md:justify-between'>
				<label htmlFor='number_game' className='m-0 mr-4 self-center text-2xl'>
					Number of puzzles
					<br />
					<span className='text-lg italic'>({size})</span>
				</label>
				<div className='mx-auto mt-2 md:mx-0 md:mt-0'>
					<Slider
						axis='x'
						x={size}
						xmin={250}
						xmax={750}
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	);
};
