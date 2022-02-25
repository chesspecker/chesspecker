import {ReactElement, useEffect, useState} from 'react';
import Layout from '@/layouts/login';
import {ButtonLink as Button} from '@/components/button';
import {useRouter} from 'next/router';
import useConffeti from '@/hooks/use-conffeti';

const SuccessPage = () => {
	const router = useRouter();
	const {session_id: sessionId} = router.query;
	const [session, setSession] = useState();

	useEffect(() => {
		if (!sessionId) return;
		const getSession = async () => {
			const response = await fetch(`/api/checkout-sessions/${sessionId}`);
			const data = await response.json();
			setSession(data);
		};

		getSession();
	}, [sessionId]);

	useEffect(() => {
		if (!session) return;
		console.log(session);
	}, [session]);

	return (
		<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
			{useConffeti()}
			<h1 className='mx-auto mt-8 mb-6 p-5 text-center font-merriweather text-3xl font-bold text-white'>
				Thanks for helping chesspecker grow!
			</h1>
			<div className='my-3 mx-0 w-full text-center text-white'>
				<Button href='/dashboard'>LET&apos;S GO! 🔥</Button>
			</div>
		</div>
	);
};

SuccessPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default SuccessPage;
