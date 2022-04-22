import type {ReactElement} from 'react';
import Layout from '@/layouts/login';
import {ButtonLink} from '@/components/button';

const Profile = () => (
	<div className='m-0 flex h-screen flex-col items-center justify-center text-slate-800'>
		<ButtonLink href='sponsor'>Become sponsor </ButtonLink>
		<p>My badges</p>
		<p>Dashboard settings</p>
	</div>
);

Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Profile;
