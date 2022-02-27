import {
	ExclamationIcon,
	InformationCircleIcon,
	CheckCircleIcon,
	XCircleIcon,
} from '@heroicons/react/solid';

const getIcon = (type: string) => {
	switch (type) {
		case 'error':
			return <XCircleIcon className='h-5 w-5 text-red-400' />;
		case 'success':
			return <CheckCircleIcon className='h-5 w-5 text-green-400' />;
		case 'info':
			return <InformationCircleIcon className='h-5 w-5 text-blue-400' />;
		case 'warning':
		default:
			return <ExclamationIcon className='h-5 w-5 text-yellow-400' />;
	}
};

const getColors = (type: string) => {
	switch (type) {
		case 'error':
			return {
				border: 'border-red-400',
				bg: 'bg-red-50',
				text: 'text-red-700',
			};
		case 'success':
			return {
				border: 'border-green-400',
				bg: 'bg-green-50',
				text: 'text-green-700',
			};
		case 'info':
			return {
				border: 'border-blue-400',
				bg: 'bg-blue-50',
				text: 'text-blue-700',
			};
		case 'warning':
		default:
			return {
				border: 'border-yellow-400',
				bg: 'bg-yellow-50',
				text: 'text-yellow-700',
			};
	}
};

type Props = {
	type: 'error' | 'info' | 'success' | 'warning';
	message: string;
	isVisible: boolean;
};

const Alert = ({type, message, isVisible}: Props) => {
	if (!isVisible) return null;
	const colors = getColors(type);
	return (
		<div
			className={`rounded-md border-l-4 ${colors.border} ${colors.bg} my-4 p-4`}
		>
			<div className='flex'>
				<div className='flex-shrink-0'>{getIcon(type)}</div>
				<div className='ml-3'>
					<p className={`text-sm ${colors.text}`}>{message}</p>
				</div>
			</div>
		</div>
	);
};

export default Alert;
