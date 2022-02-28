import {useAtom} from 'jotai';
import {useEffect, useState} from 'react';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import {optionsTitleAtom, optionsSizeAtom, optionsLevelAtom} from '@/lib/atoms';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import {origin} from '@/config';
import {fetcher} from '@/lib/fetcher';

import OptionTextInput from '@/components/options/text-input';
import OptionSize from '@/components/options/size';
import OptionDifficulty from '@/components/options/level';
import useModal from '@/hooks/use-modal';
import Alert from '@/components/alert';
import {Options} from '@/controllers/set-create';
import type {Difficulty} from '@/models/puzzle-set-model';

const OptionsPage = () => {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optionsTitleAtom);
	const [size] = useAtom<number>(optionsSizeAtom);
	const [level] = useAtom<Difficulty>(optionsLevelAtom);
	const [themeArray, setThemeArray] = useState<string[]>(['healthyMix']);
	const {isOpen, show} = useModal(false);

	useEffect(() => {
		if (router.query.category) {
			const categories: string[] = JSON.parse(
				router.query.category as string,
			) as string[];
			setThemeArray(categories);
		}
	}, [router.query.category]);

	const validate = async () => {
		if (isDisabled) return;
		if (title === '') {
			show();
			return;
		}

		setIsDisabled(() => true);
		const body: Options = {
			title,
			size,
			level,
			themeArray,
		};
		return fetcher
			.post(`${origin}/api/set`, body)
			.then(async () => router.push('/dashboard'))
			.catch(error => {
				console.error(error);
			});
	};

	return (
		<div className='-mb-24 flex min-h-screen w-11/12 flex-col items-center justify-center overflow-hidden'>
			<h1 className='text-5xl text-white'>One last thing...</h1>
			<Alert type='error' isVisible={isOpen} message='Title is needed!' />
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
