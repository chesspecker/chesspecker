import {useAtom} from 'jotai';
import {selectedAtom} from '@/lib/atoms';
import type {Theme} from '@/data/themes';

type Props = {
	theme: Theme;
};

const Choice = ({theme}: Props) => {
	const [selectedState, setSelectedState] = useAtom(selectedAtom);
	const isSelected = selectedState.includes(theme.id);

	const isDisabled = (): boolean => {
		if (selectedState.includes('healthyMix')) return true;
		if (theme.id === 'healthyMix' && selectedState.length > 0) return true;
		if (selectedState.length >= 3) return true;
	};

	const getBorderColor = (): string => {
		if (isDisabled() && !isSelected) return 'border-gray-700';
		return 'border-sky-700 dark:border-white';
	};

	const getTextColor = (): string => {
		if (isSelected) return 'text-white dark:text-sky-700';
		if (isDisabled()) return 'text-gray-400';
		return '';
	};

	const getBgColor = (): string => {
		if (isSelected) return 'bg-sky-700 dark:bg-white';
		if (isDisabled()) return 'bg-gray-700';
		return '';
	};

	const getCursor = (): string => {
		if (isSelected) return 'cursor-pointer';
		if (isDisabled()) return '';
		return 'cursor-pointer';
	};

	const handleClick = () => {
		if (isSelected) {
			setSelectedState(oldArray => oldArray.filter(id => id !== theme.id));
			return;
		}

		if (isDisabled()) return;
		setSelectedState(oldArray => [...oldArray, theme.id]);
	};

	return (
		<div
			className={`m-4 h-fit w-64 ${getCursor()} flex-wrap rounded-lg border-2 ${getBorderColor()} ${getBgColor()}`}
			onClick={handleClick}
		>
			<h4 className={`m-4 text-xl font-semibold ${getTextColor()}`}>
				{theme.title}
			</h4>
			<p className={`m-4 text-lg font-medium ${getTextColor()}`}>
				{theme.description}
			</p>
		</div>
	);
};

export default Choice;
