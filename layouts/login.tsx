const loginLayout = ({children}: {children: React.ReactNode}) => (
	<main className='flex flex-col items-center justify-center min-h-screen bg-sky-700 bg-gradient-to-t from-slate-900 to-sky-700'>
		{children}
	</main>
);

export default loginLayout;
