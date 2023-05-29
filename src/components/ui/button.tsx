import {cn} from '@/utils/classnames';

const baseStyles = {
	solid:
		'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
	outline:
		'group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none',
};

const variantStyles = {
	slate:
		'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
	blue: 'bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600',
	white:
		'bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white',
};

type ButtonProps = {
	variant?: keyof typeof baseStyles;
	color?: keyof typeof variantStyles;
} & React.ComponentProps<'button'>;

export const Button = ({
	variant = 'solid',
	color = 'slate',
	className,
	...props
}: ButtonProps) => {
	className = cn(baseStyles[variant], variantStyles[color], className);
	return <button className={className} {...props} />;
};
