import {
	ExclamationTriangleIcon,
	InformationCircleIcon,
	CheckCircleIcon,
	XCircleIcon,
} from '@heroicons/react/24/solid';

const icons = {
	error: <XCircleIcon className='h-5 w-5 text-red-400' />,
	success: <CheckCircleIcon className='h-5 w-5 text-green-400' />,
	info: <InformationCircleIcon className='h-5 w-5 text-blue-400' />,
	warning: <ExclamationTriangleIcon className='h-5 w-5 text-yellow-400' />,
};

const colors = {
	error: {
		border: 'border-red-400',
		bg: 'bg-red-50',
		text: 'text-red-700',
	},
	success: {
		border: 'border-green-400',
		bg: 'bg-green-50',
		text: 'text-green-700',
	},
	info: {
		border: 'border-blue-400',
		bg: 'bg-blue-50',
		text: 'text-blue-700',
	},
	warning: {
		border: 'border-yellow-400',
		bg: 'bg-yellow-50',
		text: 'text-yellow-700',
	},
};

type Props = {
	type: 'error' | 'info' | 'success' | 'warning';
	message: string;
	isVisible: boolean;
};

export const Alert = ({type, message, isVisible}: Props) => {
	if (!isVisible) return null;
	return (
		<div
			className={`rounded-md border-l-4 ${colors[type].border} ${colors[type].bg} my-4 p-4`}
		>
			<div className='flex'>
				<div className='shrink-0'>{icons[type]}</div>
				<div className='ml-3'>
					<p className={`text-sm ${colors[type].text}`}>{message}</p>
				</div>
			</div>
		</div>
	);
};
