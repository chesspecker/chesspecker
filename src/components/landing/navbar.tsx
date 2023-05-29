import {Logo} from '@/components/ui/logo';
import {Container} from '@/components/ui/container';
import Link from 'next/link';
import {NavLink} from '@/components/landing/nav-link';

export const LandingNavbar = () => (
	<header className='py-10 fixed w-full top-0'>
		<Container>
			<nav className='relative z-50 flex justify-between'>
				<div className='flex items-center md:gap-x-12'>
					<Link href='#' aria-label='Home'>
						<Logo className='h-10 w-auto' />
					</Link>
				</div>
				<div className='hidden md:flex md:gap-x-6'>
					<NavLink href='#features'>Features</NavLink>
					<NavLink href='#testimonials'>Testimonials</NavLink>
					<NavLink href='#pricing'>Pricing</NavLink>
				</div>
			</nav>
		</Container>
	</header>
);
