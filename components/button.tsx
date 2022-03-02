import {UrlObject} from 'url';
import Link from 'next/link';
import { memo } from 'react';

declare type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	isDisabled?: boolean;
	type?: 'submit' | 'reset' | 'button';
	href?: string | UrlObject;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({children, ...props}: ButtonProps) => (
	<button
		className='block w-full cursor-pointer self-center rounded-2xl border-none bg-white pt-2 pb-2 text-center font-merriweather text-lg font-bold leading-10 text-sky-700 hover:bg-sky-800 hover:text-white'
		type='button'
		{...props}
	>
		{children}
	</button>
);

declare type ButtonLinkProps = {
	children: React.ReactNode;
	href: string | UrlObject;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const ButtonLink = ({children, href, ...props}: ButtonLinkProps) => (
	<button
		className='block w-full cursor-pointer self-center rounded-2xl border-none bg-white pt-2 pb-2 text-center font-merriweather text-lg font-bold leading-10 text-sky-700'
		type='button'
		{...props}
	>
		<Link href={href}>
			<a>{children}</a>
		</Link>
	</button>
);

export const LeaveButton = memo(() => (
	<button
		type='button'
		className='block w-36 cursor-pointer self-center rounded-md border-none bg-gray-500 py-2 text-center font-merriweather text-lg font-bold leading-8 text-white'
	>
		<Link href='/dashboard'>
			<a>LEAVE 🧨</a>
		</Link>
	</button>
));
