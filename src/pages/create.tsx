import {useAtom} from 'jotai';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import {ArrowRightIcon} from '@heroicons/react/24/solid';
import {NextSeo} from 'next-seo';
import {Button} from '@/components/button';
import {Choice} from '@/components/choice';
import type {Category} from '@/data/categories';
import {CATEGORIES} from '@/data/categories';
import type {Theme} from '@/data/themes';
import {THEMES} from '@/data/themes';
import {Layout} from '@/layouts/main';
import {selectedCategoriesAtom} from '@/atoms/selected-categories';

const CreatePage = () => {
	const router = useRouter();
	const [choices] = useAtom(selectedCategoriesAtom);

	const handleClick = async () => {
		const list = choices.length === 0 ? ['healthyMix'] : choices;
		const categories = JSON.stringify(list);
		await router.push(`/options?category=${encodeURIComponent(categories)}`);
	};

	return (
		<>
			<NextSeo title='♟ Create' />
			<div className='mx-4 flex flex-col items-center justify-center pt-12 pb-24 md:pt-32'>
				<h2 className='text-xl font-bold sm:text-3xl'>
					Select one or more category to create your set!
				</h2>
				<div className='fixed right-10 top-40 w-36'>
					<Button className='flex justify-around' onClick={handleClick}>
						<span>NEXT</span>
						<ArrowRightIcon className='my-auto ml-4 h-5 w-5 align-middle' />
					</Button>
				</div>
				<div className='flex flex-col'>
					{CATEGORIES.map((category: Category) => (
						<div key={category.id}>
							<h3 className='mx-2 mt-4 mb-3 pb-8 text-3xl'>{category.name}</h3>
							<div className='flex w-full items-center justify-center'>
								<div className='flex w-full max-w-screen-xl items-center justify-center'>
									<div className='flex w-full flex-wrap justify-center'>
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
			</div>
		</>
	);
};

CreatePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default CreatePage;
