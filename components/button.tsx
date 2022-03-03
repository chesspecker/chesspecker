import {UrlObject} from 'url';
import Link from 'next/link';
import {memo} from 'react';
import {overrideTailwindClasses} from 'tailwind-override';

declare type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({children, onClick, type, className}: ButtonProps) => (
	<button
		className={overrideTailwindClasses(
			`block w-full cursor-pointer self-center rounded-2xl border-none bg-white pt-2 pb-2 text-center font-merriweather text-lg font-bold leading-10 text-sky-700 hover:bg-sky-800 hover:text-white ${className}`,
		)}
		/* eslint-disable-next-line react/button-has-type */
		type={type ? type : 'button'}
		onClick={onClick}
	>
		{children}
	</button>
);

declare type ButtonLinkProps = {
	children: React.ReactNode;
	href: string | UrlObject;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
};

export const ButtonLink = ({
	children,
	href,
	className,
	type,
}: ButtonLinkProps) => (
	<button
		className={overrideTailwindClasses(
			`block w-full cursor-pointer self-center rounded-2xl border-none bg-white py-2 text-center font-merriweather text-lg font-bold leading-10 text-sky-700 ${className}`,
		)}
		/* eslint-disable-next-line react/button-has-type */
		type={type ? type : 'button'}
	>
		<Link href={href}>
			<a>{children}</a>
		</Link>
	</button>
);
