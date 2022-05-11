import '@/styles/globals.css';
import '@/styles/modal.css';
import '@/styles/cg-base.css';
import '@/styles/cg-chess.css';
import '@/styles/cg-board.css';
import '@/styles/cg-pieces.css';
import {ReactElement, ReactNode, useState} from 'react';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import {SWRConfig} from 'swr';
import Router from 'next/router';
import {DefaultSeo} from 'next-seo';
import Loader from '@/components/loader';

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
	const [loading, setLoading] = useState<boolean>();
	Router.events.on('routeChangeStart', () => {
		setLoading(() => true);
	});
	Router.events.on('routeChangeComplete', () => {
		setLoading(() => false);
	});

	const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

	return getLayout(
		<>
			<DefaultSeo
				openGraph={{
					type: 'website',
					locale: 'en_IE',
					url: 'https://www.chesspecker.com/',
					site_name: 'ChessPecker',
				}}
			/>

			<SWRConfig>
				<Loader isVisible={loading} />
				<Component {...pageProps} />
			</SWRConfig>
		</>,
	);
};

export default CustomApp;
