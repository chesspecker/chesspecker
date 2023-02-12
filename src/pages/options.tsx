import {useAtom} from 'jotai';
import {useState} from 'react';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import type {Difficulty} from '@prisma/client';
import {Button} from '@/components/button';
import {OptionTextInput} from '@/components/options/text-input';
import {OptionSize} from '@/components/options/size';
import {OptionLevel} from '@/components/options/level';
import {useModal} from '@/hooks/use-modal';
import loading from '@/public/images/spinner.svg';
import {Layout} from '@/layouts/main';
import {
	optionsLevelAtom,
	optionsSizeAtom,
	optionsTitleAtom,
} from '@/atoms/options';
import {api} from '@/utils/api';
import type {CreateSetParams} from '@/types/create-set-params';

const Alert = dynamic(async () =>
	import('@/components/alert').then(module => module.Alert),
);

const OptionsPage = () => {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optionsTitleAtom);
	const [size] = useAtom<number>(optionsSizeAtom);
	const [level] = useAtom<Difficulty>(optionsLevelAtom);
	const {isOpen, show} = useModal(false);

	const createSet = api.puzzleSet.create.useMutation();

	const {data} = api.rating.get.useQuery();
	const rating = data ?? 1500;

	const themeArray = router.query.category
		? (JSON.parse(router.query.category as string) as string[])
		: ['healthyMix'];

	const validate = () => {
		if (isDisabled) return;
		if (title === '') {
			show();
			return;
		}

		setIsDisabled(() => true);
		const options: CreateSetParams = {
			title,
			size,
			level,
			themeArray,
			averageRating: rating,
		};

		createSet.mutate(options);
	};

	if (createSet.isSuccess) {
		router.push('/dashboard').catch(console.error);
		return null;
	}

	return (
		<>
			<NextSeo title='⚙️ Options' />
			<div className='flex min-h-screen w-11/12 flex-col items-center justify-center pt-12 pb-24 text-center md:pt-32'>
				<div>
					<h1 className='mb-8 text-3xl lg:text-5xl'>One last thing...</h1>
					<Alert type='error' isVisible={isOpen} message='Title is needed!' />
					<div className='mx-12 flex w-5/6 flex-col items-center justify-center'>
						<OptionTextInput>Give your set a name</OptionTextInput>
						<OptionLevel />
						<OptionSize />
						<div className='mt-20 w-3/5'>
							<Button
								className='flex h-14 cursor-default flex-row items-center justify-center font-bold hover:bg-white'
								onClick={validate}
							>
								{createSet.isLoading ? (
									<>
										<div className='visible relative mr-3 h-9 w-9 animate-spin'>
											<Image fill src={loading as string} alt='Loading...' />
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
