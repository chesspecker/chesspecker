import {ReactElement, useState} from 'react';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import Layout from '@/layouts/login';
import {Button} from '@/components/button';
import useConffeti from '@/hooks/use-conffeti';
import useEffectAsync from '@/hooks/use-effect-async';
import {User} from '@/models/user';
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
			<div className='flex flex-col items-center justify-center h-screen m-0 '>
				{useConffeti()}
				<h1 className='p-5 mx-auto mt-8 mb-6 font-sans text-3xl font-bold text-center '>
					Hello {user?.username} 👋 <br /> Welcome to chesspecker
				</h1>
				<div className='w-full mx-0 my-3 text-center '>
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
