import {useAtom} from 'jotai';
import {useState} from 'react';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import {optionsµ, ratingAtom} from '@/lib/atoms';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import OptionTextInput from '@/components/options/text-input';
import OptionSize from '@/components/options/size';
import OptionDifficulty from '@/components/options/level';
import useModal from '@/hooks/use-modal';
import type {Options} from '@/controllers/create-set';
import type {Difficulty} from '@/types/models';
import loading from '@/public/images/spinner.svg';

const Alert = dynamic(async () => import('@/components/alert'));

const OptionsPage = () => {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optionsµ.title);
	const [size] = useAtom<number>(optionsµ.size);
	const [level] = useAtom<Difficulty>(optionsµ.level);
	const [rating] = useAtom(ratingAtom);
	const {isOpen, show} = useModal(false);

	const themeArray = router.query.category
		? (JSON.parse(router.query.category as string) as string[])
		: ['healthyMix'];

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
		return fetch('/api/set', {
			method: 'POST',
			body: JSON.stringify(options),
		})
			.then(async () => router.push('/dashboard'))
			.catch(console.error);
	};

	return (
		<>
			<NextSeo title='⚙️ Options' />
			<div className='flex min-h-screen w-11/12 flex-col items-center justify-center pt-12 pb-24 text-center md:pt-32'>
				<div>
					<h1 className='mb-8 text-3xl lg:text-5xl'>One last thing...</h1>
					<Alert type='error' isVisible={isOpen} message='Title is needed!' />
					<div className='mx-12 flex w-5/6 flex-col items-center justify-center'>
						<OptionTextInput>Give your set a name</OptionTextInput>
						<OptionDifficulty />
						<OptionSize />
						<div className='mt-20 w-3/5'>
							<Button
								className='font-sky-700 flex h-14 cursor-default flex-row items-center justify-center font-bold hover:bg-white'
								onClick={validate}
							>
								{isDisabled ? (
									<>
										<div className='visible relative mr-3 h-9 w-9 animate-spin'>
											<Image
												src={loading as string}
												objectFit='contain'
												layout='fill'
											/>
										</div>
										Loading...
									</>
								) : (
									"LET'S GO! 🎉"
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

OptionsPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default OptionsPage;
