import type {AppProps, AppType} from 'next/app';
import '@/styles/globals.css';
import '@/styles/modal.css';
import '@/styles/cg-base.css';
import '@/styles/cg-chess.css';
import '@/styles/cg-board.css';
import '@/styles/cg-pieces.css';
import type {NextPage} from 'next';
import type {ReactElement, ReactNode} from 'react';
import {DefaultSeo} from 'next-seo';
import {api} from '@/utils/api';

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const MyApp = ({Component, pageProps}: AppPropsWithLayout) => {
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

			<Component {...pageProps} />
		</>,
	);
};

export default api.withTRPC(MyApp as AppType);
