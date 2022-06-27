import type {ReactElement} from 'react';
import Link from 'next/link';
import {GetStaticProps} from 'next';
import {useI18n, I18nProps} from 'next-rosetta';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';
import type {Locale} from '@/types/i18n';

const LostPage = () => {
	const i18n = useI18n<Locale>();
	const {t} = i18n;

	return (
		<div className='flex flex-col items-center justify-center h-screen m-0'>
			<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center'>
				{t('404.title')}
			</h1>
			<div className='w-full mx-0 my-3 text-center '>
				<Link href='/dashboard'>
					<a>
						<Button className='py-4'> {t('404.button')}</Button>
					</a>
				</Link>
			</div>
		</div>
	);
};

LostPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getStaticProps: GetStaticProps<
	I18nProps<Locale>
> = async context => {
	const locale = context.locale ?? context.defaultLocale ?? 'en';
	const {table} = (await import(`../i18n/${locale}`)) as {table: Locale};
	return {props: {table}};
};

export default LostPage;
