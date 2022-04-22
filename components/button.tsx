import {UrlObject} from 'url';
import Link from 'next/link';
import {overrideTailwindClasses} from 'tailwind-override';

declare type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const defaultClasses =
	'block cursor-pointer w-full rounded-2xl font-merriweather text-sm md:text-lg font-bold leading-10 bg-white self-center py-2 px-2.5 text-center text-sky-800 bg-opacity-70 hover:bg-white hover:bg-opacity-90 backdrop-filter backdrop-blur-lg hover:text-sky-600 border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500';

export const Button = ({children, onClick, type, className}: ButtonProps) => (
	<button
		className={overrideTailwindClasses(`${defaultClasses} ${className}`)}
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
	<Link href={href}>
		<a>
			<button
				className={overrideTailwindClasses(`${defaultClasses} ${className}`)}
				/* eslint-disable-next-line react/button-has-type */
				type={type ? type : 'button'}
			>
				{children}
			</button>
		</a>
	</Link>
);
