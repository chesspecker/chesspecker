import {useAtom} from 'jotai';
import type {ReactElement} from 'react';
import {useRouter} from 'next/router';
import {ArrowRightIcon} from '@heroicons/react/solid';
import {NextSeo} from 'next-seo';
import Layout from '@/layouts/main';
import {Button} from '@/components/button';
import Choice from '@/components/choice';
import {selectedAtom} from '@/lib/atoms';
import CATEGORIES from '@/data/categories';
import THEMES from '@/data/themes';
import type {Category} from '@/data/categories';
import type {Theme} from '@/data/themes';

const CreatePage = () => {
	const router = useRouter();
	const [choices] = useAtom(selectedAtom);

	const handleClick = async () => {
		const list = choices.length === 0 ? ['healthyMix'] : choices;
		const categories = JSON.stringify(list);
		await router.push(`/options?category=${encodeURIComponent(categories)}`);
	};

	return (
		<>
			<NextSeo title='♟ Create' />
			<div className='flex flex-col items-center justify-center pt-12 md:pt-32 pb-24 mx-4'>
				<h2 className='text-xl font-bold sm:text-3xl'>
					Select one or more category to create your set!
				</h2>
				<div className='fixed w-36 right-10 top-40'>
					<Button className='flex justify-around' onClick={handleClick}>
						<span>NEXT</span>
						<ArrowRightIcon className='w-5 h-5 my-auto ml-4 align-middle' />
					</Button>
				</div>
				<div className='flex flex-col jus'>
					{CATEGORIES.map((category: Category) => (
						<div key={category.id}>
							<h3 className='pb-8 mx-2 mt-4 mb-3 text-3xl'>{category.name}</h3>
							<div className='flex items-center justify-center w-full'>
								<div className='flex items-center justify-center w-full max-w-screen-xl'>
									<div className='flex flex-wrap justify-center w-full'>
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
