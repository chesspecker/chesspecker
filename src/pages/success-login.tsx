import type {ReactElement} from 'react';
import {useState} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import type {User} from '@/models/user';
import {getUser} from '@/lib/api-helpers';

const IndexPage = () => {
	const [user, setUser] = useState<User>();

	useEffectAsync(async () => {
		const response = await getUser();
		if (response.success) setUser(() => response.data);
	}, []);

	return (
		<>
			<NextSeo title='🎉 Success' />
			<div className='m-0 flex h-screen flex-col items-center justify-center'>
				{useConffeti()}
				<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-sans text-3xl font-bold'>
					Hello {user?.username} 👋 <br /> Welcome to chesspecker
				</h1>
				<div className='mx-0 my-3 w-4/5 text-center'>
					<Link href='/dashboard'>
						<a>
							<Button className='py-4'>LET&apos;S GO! 🔥</Button>
						</a>
					</Link>
				</div>
			</div>
		</>
	);
};

IndexPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default IndexPage;
