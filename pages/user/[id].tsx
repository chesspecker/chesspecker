import type {ReactElement} from 'react';
import Layout from '@/layouts/login';
import {ButtonLink} from '@/components/button';
import {fetcher} from '@/lib/fetcher';

import {Data as UserData} from '@/api/user/[id]';

const Profile = ({user}) => {


	return	<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
			<ButtonLink href='sponsor'>Become sponsor </ButtonLink>
			<p>My badges</p>
			<p>Dashboard settings</p>
		</div>,

}

Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Profile;

interface SSRProps {
	params: {id: string | undefined};
}

export const getServerSideProps = async ({params}: SSRProps) => {
	const id: string = params.id;
	const data = (await fetcher.get(`/api/user/${id}`)) as UserData;
	if (!data.success) return {notFound: true};
	return {props: {user: data}};
};
