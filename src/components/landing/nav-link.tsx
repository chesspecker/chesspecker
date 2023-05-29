import Link from 'next/link';
import {PropsWithChildren} from 'react';

type Props = {
	href: string;
};

export const NavLink = ({href, children}: PropsWithChildren<Props>) => {
	return (
		<Link
			href={href}
			className='flex rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 items-center justify-center'
		>
			{children}
		</Link>
	);
};
