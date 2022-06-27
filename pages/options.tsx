import {useAtom} from 'jotai';
import {useState} from 'react';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {NextSeo} from 'next-seo';
import dynamic from 'next/dynamic';
import {GetStaticProps} from 'next';
import {useI18n, I18nProps} from 'next-rosetta';
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
import type {Locale} from '@/types/i18n';

const Alert = dynamic(async () => import('@/components/alert'));

const OptionsPage = () => {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [title] = useAtom<string>(optionsµ.title);
	const [size] = useAtom<number>(optionsµ.size);
	const [level] = useAtom<Difficulty>(optionsµ.level);
	const [rating] = useAtom(ratingAtom);
	const {isOpen, show: showAlert} = useModal(false);
	const i18n = useI18n<Locale>();
	const {t} = i18n;

	const themeArray = router.query.category
		? (JSON.parse(router.query.category as string) as string[])
		: ['healthyMix'];

	const validate = async () => {
		if (isDisabled) return;
		if (title === '') {
			showAlert();
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
			<div className='flex flex-col items-center justify-center w-11/12 min-h-screen pt-32 pb-24 text-center'>
				<div>
					<h1 className='mb-8 text-3xl lg:text-5xl'>{t('options.title')}</h1>
					<Alert type='error' isVisible={isOpen} message='Title is needed!' />
					<div className='flex flex-col items-center justify-center w-5/6 mx-12'>
						<OptionTextInput />
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
										{t('options.button.loading')}
									</>
								) : (
									t('options.button.base')
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

export const getStaticProps: GetStaticProps<
	I18nProps<Locale>
> = async context => {
	const locale = context.locale ?? context.defaultLocale ?? 'en';
	const {table} = (await import(`../i18n/${locale}`)) as {table: Locale};
	return {props: {table}};
};

export default OptionsPage;
