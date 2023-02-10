import type {ReactElement} from 'react';
import {useState} from 'react';
import {NextSeo} from 'next-seo';
import {useRouter} from 'next/router';
import type {ResponseData} from './api/failed';
import Layout from '@/layouts/main';
import useEffectAsync from '@/hooks/use-effect-async';
import type {Activity} from '@/types/lichess';
import {Button} from '@/components/button';

const OptionsPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>();
	const [failed, setFailed] = useState<Activity>();
	const router = useRouter();

	useEffectAsync(async () => {
		try {
			const response = await fetch('/api/failed').then(
				async response => response.json() as Promise<ResponseData>,
			);

			setIsLoading(() => false);

			if (!response.success) {
				setError(response.error);
				return;
			}

			const failed = response.data.activity.filter(item => !item.win);
			if (failed.length === 0) return;
			setFailed(failed);
		} catch (error: unknown) {
			const error_ = error as Error;
			setError(error_.message);
		}
	}, []);

	const handleClick = async () => {
		await fetch('/api/failed', {
			method: 'POST',
			body: JSON.stringify({
				activity: failed,
				name: 'Failed puzzles',
			}),
		})
			.then(async () => router.push('/dashboard'))
			.catch(console.error);
	};

	return (
		<>
			<NextSeo title='♟ Create' />
			<div className='flex min-h-screen w-11/12 flex-col items-center justify-center pt-12 pb-24 text-center md:pt-32'>
				<div>
					{isLoading && (
						<h1 className='mb-8 text-3xl lg:text-5xl'>Looking for puzzles…</h1>
					)}
					{!isLoading && error && (
						<h1 className='mb-8 text-3xl lg:text-5xl'>{error}</h1>
					)}
					{!isLoading && failed && failed.length === 0 && (
						<h1 className='mb-8 text-3xl lg:text-5xl'>
							No failed puzzles found
						</h1>
					)}
					{!isLoading && failed && failed.length > 0 && (
						<>
							<h1 className='mb-8 text-3xl lg:text-5xl'>
								{failed.length} failed puzzles found
							</h1>
							<Button onClick={handleClick}>Create a custom set</Button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

OptionsPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default OptionsPage;
