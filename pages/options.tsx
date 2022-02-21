import {useAtom} from 'jotai';
import {useState} from 'react';
import Router from 'next/router';
import type {ReactElement} from 'react';
import {optsTitleAtom, optsSizeAtom, optsLevelAtom} from '@/lib/atoms';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import {origin} from '@/config';
import {fetcher} from '@/lib/fetcher';

import OptionTextInput from '@/components/options/text-input';
import OptionSize from '@/components/options/size';
import OptionDifficulty from '@/components/options/level';

const OptionsPage = () => {
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optsTitleAtom);
	const [size] = useAtom<number>(optsSizeAtom);
	const [level] = useAtom<string>(optsLevelAtom);

	// TODO: add context newSet

	const validate = async () => {
		if (isDisabled) return;
		// If (title === '') return setToggleError(() => true);
		setIsDisabled(() => true);
		return fetcher
			.post(`${origin}/api/set`, {
				title,
				//	ThemeArray: newSet.themeArray,
				size,
				level,
			})
			.then(() => {
				Router.push('/dashboard');
			})
			.catch(error => {
				console.error(error);
			});
	};

	return (
		<div className='flex h-screen w-11/12 flex-col items-center justify-center overflow-hidden'>
			<h2 className='text-5xl text-white'>One last thing...</h2>
			<div className='flex flex-col items-center justify-center overflow-hidden'>
				<OptionTextInput>Give your set a name</OptionTextInput>

				<OptionDifficulty />
				<OptionSize />

				<div className='mt-20 w-4/5'>
					<Button onClick={validate}>
						{isDisabled ? 'Loading...' : `LET'S GO! 🎉`}
					</Button>
				</div>
			</div>
		</div>
	);
};

OptionsPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default OptionsPage;
