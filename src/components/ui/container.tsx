import {cn} from '@/utils/classnames';
import {PropsWithChildren} from 'react';

type Props = {
	className?: string;
};

export const Container = ({
	className,
	children,
	...props
}: PropsWithChildren<Props>) => {
	return (
		<div
			className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
			{...props}
		>
			{children}
		</div>
	);
};
