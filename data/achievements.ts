type Args = {
	strikeMistakes: number;
	strikeTime: number;
	lastTime: number;
};

export type AchievementInterface = {
	id: string;
	name: string;
	description: string;
	isValidated: (args: Args) => boolean;
	image: string;
};

export const achievements: AchievementInterface[] = [
	{
		id: 'first-puzzle',
		name: 'First Puzzle',
		description: 'You completed your first puzzle.',
		isValidated: (args: Args) => true,
		image:
			'http://www.lespetitslapins.fr/wp-content/uploads/2011/01/pan-pan1.jpg',
	},
	{
		id: 'rabbit',
		name: 'Rabbit',
		description: 'series of 20 puzzles in less than 5 seconds',
		isValidated: (args: Args) => args.strikeTime > 20,
		image:
			'http://www.lespetitslapins.fr/wp-content/uploads/2011/01/pan-pan1.jpg',
	},
	{
		id: 'rabbit-master',
		name: 'Rabbit Master',
		description: 'series of 30 puzzles in less than 5 seconds',
		isValidated: (args: Args) => args.strikeTime > 30,
		image:
			'http://www.lespetitslapins.fr/wp-content/uploads/2011/01/pan-pan1.jpg',
	},
	{
		id: 'super-rabbit-master',
		name: 'Super RabitMaster',
		description: 'series of 50 puzzles in less than 5 seconds',
		isValidated: (args: Args) => args.strikeTime > 50,
		image:
			'http://www.lespetitslapins.fr/wp-content/uploads/2011/01/pan-pan1.jpg',
	},
];
