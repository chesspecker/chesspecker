import Slider from 'react-input-slider';
import {useAtom} from 'jotai';
import {useI18n} from 'next-rosetta';
import {optionsµ} from '@/lib/atoms';
import {Locale} from '@/types/i18n';

const OptionSize = () => {
	const [size, setSize] = useAtom(optionsµ.size);
	const i18n = useI18n<Locale>();
	const {t} = i18n;

	const handleChange = (values: {x: number; y: number}) => {
		setSize(() => values.x);
	};

	return (
		<div className='flex flex-col w-full my-8 md:flex-row'>
			<div className='flex flex-col justify-center w-full md:flex-row md:justify-between'>
				<label htmlFor='number_game' className='self-center m-0 mr-4 text-2xl'>
					{t('options.size.label')}
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

export default OptionSize;
