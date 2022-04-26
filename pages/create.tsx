import {useAtom} from 'jotai';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import CATEGORIES from '@/data/categories';
import THEMES from '@/data/themes';
import Choice from '@/components/choice';
import {selectedAtom} from '@/lib/atoms';

import type {Category} from '@/data/categories';
import type {Theme} from '@/data/themes';

const CreatePage = () => {
	const router = useRouter();
	const [choicesSelected, setChoicesSelected] = useAtom(selectedAtom);

	const handleClick = async () => {
		if (choicesSelected.length === 0) setChoicesSelected(() => ['healthyMix']);
		await router.push(
			`/options?category=${encodeURIComponent(
				JSON.stringify(choicesSelected),
			)}`,
		);
	};

	return (
		<div className='flex flex-col items-center justify-center'>
			<h2 className=' text-xl font-bold text-white sm:text-3xl'>
				Select one or more category to create your set!
			</h2>
			<div className='jus flex flex-col'>
				{CATEGORIES.map((category: Category) => (
					<div key={category.id}>
						<h3 className='mx-2 mt-4 mb-3 pb-8 text-3xl text-white'>
							{category.name}
						</h3>
						<div className='w-full flex items-center justify-center'>
							<div className='flex justify-center items-center w-full max-w-screen-xl'>
								<div className='flex w-full flex-wrap  justify-center'>
									{THEMES.filter(
										(theme: Theme) => theme.category.name === category.name,
									).map((theme: Theme) => (
										<Choice key={theme.id} theme={theme} />
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className='sticky bottom-0 right-0 w-6/12'>
				<Button onClick={handleClick}>NEXT</Button>
			</div>
		</div>
	);
};

CreatePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default CreatePage;
