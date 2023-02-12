import Link from 'next/link';
import {cn} from '@/utils/cn';

declare type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const defaultClasses =
	'cursor-pointer bg-white shadow-sm hover:bg-slate-200 hover:text-sky-600 text-center max-w-lg w-full flex item-center justify-center px-4 py-2 rounded-lg text-sky-800 backdrop-filter backdrop-blur-lg font-bold';

export const Button = ({children, onClick, type, className}: ButtonProps) => (
	<button
		className={cn(defaultClasses, className)}
		/* eslint-disable-next-line react/button-has-type */
		type={type ?? 'button'}
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
		<button
			className={cn(defaultClasses, className)}
			/* eslint-disable-next-line react/button-has-type */
			type={type ?? 'button'}
		>
			{children}
		</button>
	</Link>
);
