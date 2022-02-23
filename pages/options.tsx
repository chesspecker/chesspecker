import {useAtom} from 'jotai';
import {useEffect, useState} from 'react';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import {optsTitleAtom, optsSizeAtom, optsLevelAtom} from '@/lib/atoms';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import {origin} from '@/config';
import {fetcher} from '@/lib/fetcher';

import OptionTextInput from '@/components/options/text-input';
import OptionSize from '@/components/options/size';
import OptionDifficulty from '@/components/options/level';

const OptionsPage = () => {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optsTitleAtom);
	const [size] = useAtom<number>(optsSizeAtom);
	const [level] = useAtom<string>(optsLevelAtom);
	const [choices, setChoices] = useState<string[]>(['healthyMix']);

	useEffect(() => {
		if (router.query.category) {
			const categories = JSON.parse(router.query.category as string);
			setChoices(categories);
		}
	}, []);

	const validate = async () => {
		if (isDisabled) return;
		if (title === '') return;
		// If (title === '') return setToggleError(() => true);
		setIsDisabled(() => true);
		return fetcher
			.post(`${origin}/api/set`, {
				title,
				themeArray: choices,
				size,
				level,
			})
			.then(() => {
				router.push('/dashboard');
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
