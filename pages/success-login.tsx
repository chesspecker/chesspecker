import {ReactElement, useState} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import type {GetStaticProps} from 'next';
import {useI18n, I18nProps} from 'next-rosetta';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import {User} from '@/models/user';
import {getUser} from '@/lib/api-helpers';
import type {Locale} from '@/types/i18n';

const IndexPage = () => {
	const [user, setUser] = useState<User>();

	const i18n = useI18n<Locale>();
	const {t} = i18n;

	useEffectAsync(async () => {
		const response = await getUser();
		if (response.success) setUser(() => response.data);
	}, []);

	return (
		<>
			<NextSeo title='🎉 Success' />
			<div className='flex flex-col items-center justify-center h-screen m-0'>
				{useConffeti()}
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center'>
					{t('success-login.hello', {username: user?.username})}
					<br /> {t('success-login.welcome')}
				</h1>
				<div className='w-full mx-0 my-3 text-center '>
					<Link href='/dashboard'>
						<a>
							<Button className='py-4'>{t('success-login.button')}</Button>
						</a>
					</Link>
				</div>
			</div>
		</>
	);
};

IndexPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getStaticProps: GetStaticProps<
	I18nProps<Locale>
> = async context => {
	const locale = context.locale ?? context.defaultLocale ?? 'en';
	const {table} = (await import(`../i18n/${locale}`)) as {table: Locale};
	return {props: {table}};
};

export default IndexPage;
