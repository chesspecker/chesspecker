import {Html, Head, Main, NextScript} from 'next/document.js';

const Document = () => {
	return (
		<Html lang='en'>
			<Head>
				{/* Meta properties */}
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				/>
				<meta name='apple-mobile-web-app-title' content='Chesspecker' />
				<link rel='manifest' href='/manifest.json' />
				<link rel='apple-touch-icon' href='/icon.png' />
				<meta name='theme-color' content='#fff' />
				<link rel='canonical' href='https://www.chesspecker.com/' />
				{/* Favicon */}
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/favicon/apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon/favicon-16x16.png'
				/>
				<link rel='manifest' href='/favicon/site.webmanifest' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body className={`min-h-screen min-w-screen bg-sky-700 `}>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
