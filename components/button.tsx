import {UrlObject} from 'url';
import Link from 'next/link';

declare type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	type?: 'submit' | 'reset' | 'button';
	href?: string | UrlObject;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({children, ...props}: ButtonProps) => (
	<button
		className='block w-full cursor-pointer self-center rounded-2xl border-none bg-white pt-2 pb-2 text-center font-merriweather text-lg font-bold leading-10 text-sky-700'
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
