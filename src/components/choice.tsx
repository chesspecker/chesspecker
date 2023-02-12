import {useAtom} from 'jotai';
import type {Theme} from '@/data/themes';
import {selectedCategoriesAtom} from '@/atoms/selected-categories';
import {cn} from '@/utils/cn';

type Props = {
	theme: Theme;
};

export const Choice = ({theme}: Props) => {
	const [selectedState, setSelectedState] = useAtom(selectedCategoriesAtom);
	const isSelected = selectedState.includes(theme.id);

	const isDisabled = (): boolean =>
		!!(
			selectedState.includes('healthyMix') ||
			(theme.id === 'healthyMix' && selectedState.length > 0) ||
			selectedState.length >= 3
		);

	const getBorderColor = (): string => {
		if (isDisabled() && !isSelected) return 'border-gray-700';
		return 'border-white';
	};

	const getTextColor = (): string => {
		if (isSelected) return 'text-sky-700';
		if (isDisabled()) return 'text-gray-400';
		return '';
	};

	const getBgColor = (): string => {
		if (isSelected) return 'bg-white';
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
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<div
			className={cn(
				'm-4 h-fit w-64',
				getCursor(),
				'flex-wrap rounded-lg border-2',
				getBorderColor(),
				getBgColor(),
			)}
			onClick={handleClick}
		>
			<h4 className={cn('m-4 text-xl font-semibold', getTextColor())}>
				{theme.title}
			</h4>
			<p className={cn('m-4 text-lg font-medium', getTextColor())}>
				{theme.description}
			</p>
		</div>
	);
};
