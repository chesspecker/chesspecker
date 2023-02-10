import Link from 'next/link';
import {overrideTailwindClasses} from 'tailwind-override';

declare type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const defaultClasses =
	'cursor-pointer bg-sky-800 dark:bg-white shadow-sm hover:dark:bg-slate-200 hover:dark:text-sky-600 hover:bg-sky-700 text-center max-w-lg w-full flex item-center justify-center px-4 py-2 rounded-lg text-white dark:text-sky-800 backdrop-filter backdrop-blur-lg font-bold';

export const Button = ({children, onClick, type, className}: ButtonProps) => (
	<button
		className={overrideTailwindClasses(`${defaultClasses} ${className || ''}`)}
		/* eslint-disable-next-line react/button-has-type */
		type={type || 'button'}
		onClick={onClick}
	>
		{children}
	</button>
);

declare type ButtonLinkProps = {
	children: React.ReactNode;
	href: string;
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
		<a target='_blank'>
			<button
				className={overrideTailwindClasses(
					`${defaultClasses} ${className || ''}`,
				)}
				/* eslint-disable-next-line react/button-has-type */
				type={type || 'button'}
			>
				{children}
			</button>
		</a>
	</Link>
);
