import '@/styles/globals.css';
import '@/styles/modal.css';
import '@/styles/cg-base.css';
import '@/styles/cg-chess.css';
import '@/styles/cg-board.css';
import '@/styles/cg-pieces.css';
import {ReactElement, ReactNode, useEffect, useState} from 'react';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import {SWRConfig} from 'swr';
import {useRouter} from 'next/router';
import {DefaultSeo} from 'next-seo';
import PlausibleProvider from 'next-plausible';
import {I18nProvider} from 'next-rosetta';
import Loader from '@/components/loader';
import useEffectAsync from '@/hooks/use-effect-async';
import {Locale} from '@/types/i18n';

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const CustomApp = ({
	Component,
	pageProps: {session, ...pageProps},
}: AppPropsWithLayout) => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const setTrue = () => {
			setLoading(() => true);
		};

		const setFalse = () => {
			setLoading(() => false);
		};

		router.events.on('routeChangeStart', setTrue);
		router.events.on('routeChangeComplete', setFalse);

		return () => {
			router.events.off('routeChangeStart', setTrue);
			router.events.off('routeChangeComplete', setFalse);
		};
	}, [router.events]);

	useEffectAsync(async () => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.getRegistrations()
				.then(async registrations => {
					for (const registration of registrations) {
						/* eslint-disable-next-line no-await-in-loop */
						await registration.unregister();
					}
				})
				.catch(console.error);
		}
	}, []);

	const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

	return getLayout(
		<>
			<DefaultSeo
				openGraph={{
					type: 'website',
					locale: 'en_US',
					title: 'Chesspecker',
					url: 'https://www.chesspecker.com/',
					site_name: 'Chesspecker',
					images: [
						{
							url: 'https://www.chesspecker.com/images/banner.jpg',
							secureUrl: 'https://www.chesspecker.com/images/banner.jpg',
							width: 1200,
							height: 627,
							alt: 'chesspecker',
							type: 'image/jpg',
						},
					],
					description:
						'Start improving your chess skills today with chesspecker’s training.',
				}}
				titleTemplate='%s | Chesspecker'
				description='Start improving your chess skills today with chesspecker’s training. Climb the elo rating using the woodpecker method.'
				additionalMetaTags={[
					{name: 'robots', content: 'index, follow'},
					{name: 'viewport', content: 'initial-scale=1.0, width=device-width'},
				]}
			/>

			<SWRConfig>
				<PlausibleProvider domain='chesspecker.com'>
					<Loader isVisible={loading} />
					<I18nProvider table={pageProps.table as Locale}>
						<Component {...pageProps} />
					</I18nProvider>
				</PlausibleProvider>
			</SWRConfig>
		</>,
	);
};

export default CustomApp;
