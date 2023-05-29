import Timer from '@/components/play/timer';
import prisma from '@/utils/prisma';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {PropsWithChildren} from 'react';

type Props = {
	params: {
		setId: string;
	};
};

export async function generateMetadata({
	params: {setId},
}: Props): Promise<Metadata> {
	const set = await prisma.puzzleSet.findUnique({
		where: {id: setId},
	});

	return {
		title: `Chesspecker • ${set?.title}`,
	};
}

const getSetById = async (id: string) =>
	prisma.puzzleSet.findUnique({where: {id}});

const Layout = async ({
	children,
	params: {setId},
}: PropsWithChildren<Props>) => {
	const set = await getSetById(setId);

	if (!set) {
		return notFound();
	}

	return (
		<div className='w-full h-full min-h-screen flex justify-center items-center flex-col'>
			<h1>Play Puzzle</h1>
			<p>Set: {set.title}</p>
			<Timer />
			{children}
		</div>
	);
};

export default Layout;
