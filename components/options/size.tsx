import Slider from 'react-input-slider';
import {useAtom} from 'jotai';
import {optionsSizeAtom} from '@/lib/atoms';

const OptionSize = () => {
	const [size, setSize] = useAtom(optionsSizeAtom);
	const handleChange = (values: {x: number; y: number}) => {
		setSize(() => values.x);
	};

	return (
		<div className='mt-8 flex w-full flex-col items-stretch justify-between border-2 border-white text-left'>
			<div className='flex justify-between'>
				<label
					htmlFor='number_game'
					className='m-0 mr-4 self-center text-3xl text-white'
				>
					Number of puzzles: {size}
				</label>
				<div className='mt-3'>
					<Slider
						axis='x'
						x={size}
						xmin={250}
						xmax={750}
						onChange={handleChange}
					/>
				</div>
			</div>
			<p className='text-2xl text-white'>Recommended number is around 500</p>
		</div>
	);
};

export default OptionSize;
