import './globals.css';
import '@/styles/cg-base.css';
import '@/styles/cg-chess.css';
import '@/styles/cg-board.css';
import '@/styles/cg-pieces.css';
import {Poppins} from 'next/font/google';
import {ClerkProvider} from '@clerk/nextjs';

const fontPoppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '700', '800', '900'],
	style: ['normal', 'italic'],
	display: 'swap',
	variable: '--font-poppins',
});

export const metadata = {
	title: 'Chesspecker ⚔️',
	description:
		'Start improving your chess skills today. Climb the elo rating with the woodpecker method.',
};

const RootLayout = ({children}: {children: React.ReactNode}) => {
	return (
		<ClerkProvider>
			<html
				lang='en'
				className={`h-full min-w-[360px] scroll-smooth bg-white ${fontPoppins.variable}`}
			>
				<body className='min-h-screen antialiased'>
					<main className='flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center bg-white text-center text-black font-poppins'>
						{children}
					</main>
				</body>
			</html>
		</ClerkProvider>
	);
};

export default RootLayout;
