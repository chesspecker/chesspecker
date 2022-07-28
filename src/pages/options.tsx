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
import {Options} from '@/controllers/create-set';
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
		return fetch(`/api/set`, {
			method: 'POST',
			body: JSON.stringify(options),
		})
			.then(async () => router.push('/dashboard'))
			.catch(console.error);
	};

	return (
		<>
			<NextSeo title='⚙️ Options' />
			<div className='flex flex-col items-center justify-center w-11/12 min-h-screen pt-12 md:pt-32 pb-24 text-center'>
				<div>
					<h1 className='mb-8 text-3xl lg:text-5xl'>One last thing...</h1>
					<Alert type='error' isVisible={isOpen} message='Title is needed!' />
					<div className='flex flex-col items-center justify-center w-5/6 mx-12'>
						<OptionTextInput>Give your set a name</OptionTextInput>
						<OptionDifficulty />
						<OptionSize />
						<div className='w-3/5 mt-20'>
							<Button
								className='flex h-14 flex-row items-center justify-center font-sky-700 font-bold cursor-default hover:bg-white'
								onClick={validate}
							>
								{isDisabled ? (
									<>
										<div className='relative mr-3 h-9 w-9 animate-spin visible'>
											<Image
												src={loading as string}
												objectFit='contain'
												layout='fill'
											/>
										</div>
										Loading...
									</>
								) : (
									`LET'S GO! 🎉`
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
