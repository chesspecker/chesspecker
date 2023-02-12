export const LoginLayout = ({children}: {children: React.ReactNode}) => (
	<main>
		<div className='relative flex h-full min-h-screen flex-col items-center justify-between overflow-y-scroll bg-gradient-to-t  from-slate-900 to-sky-700 font-sans text-white disable-scrollbars'>
			{children}
		</div>
	</main>
);
