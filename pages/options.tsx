import {useAtom} from 'jotai';
import {useEffect, useState} from 'react';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {
	optionsTitleAtom,
	optionsSizeAtom,
	optionsLevelAtom,
	ratingAtom,
} from '@/lib/atoms';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import OptionTextInput from '@/components/options/text-input';
import OptionSize from '@/components/options/size';
import OptionDifficulty from '@/components/options/level';
import useModal from '@/hooks/use-modal';
import Alert from '@/components/alert';
import {Options} from '@/controllers/set-create';
import type {Difficulty} from '@/types/models';
import loading from '@/public/images/loading.png';

const OptionsPage = () => {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optionsTitleAtom);
	const [size] = useAtom<number>(optionsSizeAtom);
	const [rating] = useAtom(ratingAtom);
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
		const options: Options = {
			title,
			size,
			level,
			themeArray,
			averageRating: rating,
		};
		return fetch(`/api/set`, {
			method: 'PUT',
			body: JSON.stringify(options),
		})
			.then(async () => router.push('/dashboard'))
			.catch(error => {
				console.error(error);
			});
	};

	return (
		<div className='flex min-h-screen w-11/12 flex-col items-center justify-center pt-32 pb-24 text-center'>
			<div>
				<h1 className='mb-8 text-5xl text-white'>One last thing...</h1>
				<Alert type='error' isVisible={isOpen} message='Title is needed!' />
				<div className='mx-12 flex w-5/6 flex-col items-center justify-center'>
					<OptionTextInput>Give your set a name</OptionTextInput>
					<OptionDifficulty />
					<OptionSize />
					<div className='mt-20 w-3/5 '>
						<Button
							className={`flex h-14 flex-row items-center justify-center ${
								isDisabled
									? 'font-sky-700 cursor-default hover:bg-white'
									: 'cursor-pointer'
							}`}
							onClick={validate}
						>
							<div
								className={`relative mr-3 h-9 w-9 animate-spin ${
									isDisabled ? 'visible' : 'invisible'
								}`}
							>
								<Image src={loading} objectFit='contain' layout='fill' />
							</div>
							{isDisabled ? 'Loading...' : `LET'S GO! 🎉`}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

OptionsPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default OptionsPage;
