import {useState, useEffect, useCallback, ReactElement} from 'react';
import * as ChessJS from 'chess.js';
import {ChessInstance, Square, ShortMove} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {GetServerSidePropsContext, Redirect} from 'next';
import useSWR from 'swr';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {AchivementsArgs} from '@/types/models';
import Layout from '@/layouts/main';
import {formattedDate, sortBy} from '@/lib/utils';
import useEffectAsync from '@/hooks/use-effect-async';
import audio from '@/lib/sound';
import {configµ, orientationµ, animationµ, playµ, revertedµ} from '@/lib/atoms';
import useModal from '@/hooks/use-modal';
import useKeyPress from '@/hooks/use-key-press';
import {Button} from '@/components/button';
import {checkForAchievement} from '@/lib/achievements';
import {withSessionSsr} from '@/lib/session';
import {PreviousPuzzle} from '@/components/play/bottom-bar/history';
import {
	activateSpacedRepetion,
	updateSpacedRepetition,
} from '@/lib/spaced-repetition';
import {User} from '@/models/user';
import {Puzzle} from '@/models/puzzle';
import {PuzzleSet} from '@/models/puzzle-set';
import {PuzzleItem} from '@/models/puzzle-item';
import type {UserData} from '@/pages/api/user';
import {
	incrementStreakCount,
	resetStreakCount,
	shouldIncrementOrResetStreakCount,
	updateStreak,
} from '@/lib/streak';
import {
	get as get_,
	update as update_,
	UpdateUser,
	getGrade,
	getMovable,
	getThemes,
	getTimeInterval,
	getTimeTaken,
	getUpdateBody,
} from '@/lib/play';
import {Stat} from '@/components/play/left-bar';
import {Streak} from '@/models/streak';

const Notification = dynamic(async () => import('@/components/notification'));
const Timer = dynamic(async () => import('@/components/play/timer'));
const Board = dynamic(async () => import('@/components/play/board'));
const LeftBar = dynamic(async () => import('@/components/play/left-bar'));
const RightBar = dynamic(async () => import('@/components/play/right-bar'));
const BottomBar = dynamic(async () => import('@/components/play/bottom-bar'));
const ModalSpacedOn = dynamic(
	async () => import('@/components/play/modal-spaced-on'),
);
const ModalSpacedEnd = dynamic(
	async () => import('@/components/play/modal-spaced-end'),
);

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;
const getColor = (string_: 'w' | 'b') => (string_ === 'w' ? 'white' : 'black');
const fetcher = async (endpoint: string): Promise<UserData> =>
	fetch(endpoint).then(async response => response.json() as Promise<UserData>);

/* eslint-disable-next-line no-promise-executor-return */
const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms));

type Props = {set: PuzzleSet};
const PlayingPage = ({set}: Props) => {
	const [hasAutoMove] = useAtom(configµ.autoMove);
	const [hasSound] = useAtom(configµ.sound);
	const [hasClock] = useAtom(configµ.hasClock);
	const [hasAnimation] = useAtom(configµ.animation);
	const [isSolutionClicked, setIsSolutionClicked] = useAtom(playµ.solution);
	const [initialPuzzleTimer, setInitialPuzzleTimer] = useAtom(playµ.timer);
	const [, setTotalPuzzles] = useAtom(playµ.totalPuzzles);
	const [isComplete, setIsComplete] = useAtom(playµ.isComplete);
	const [completedPuzzles, setCompletedPuzzles] = useAtom(playµ.completed);
	const [orientation, setOrientation] = useAtom(orientationµ);
	const [isReverted] = useAtom(revertedµ);
	const [, setAnimation] = useAtom(animationµ);
	const [chess, setChess] = useState<ChessInstance>(new Chess());
	const [config, setConfig] = useState<Partial<Config>>();
	const [puzzleList, setPuzzleList] = useState<PuzzleItem[]>([]);
	const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
	const [puzzle, setPuzzle] = useState<Puzzle>();
	const [nextPuzzle, setNextPuzzle] = useState<Puzzle>();
	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [lastMove, setLastMove] = useState<Square[]>([]);
	const [previousPuzzle, setPreviousPuzzle] = useState<PreviousPuzzle[]>([]);
	const [totalMistakes, setTotalMistakes] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [initialSetTimer, setInitialSetTimer] = useState<number>(0);
	const [initialSetDate, setInitialSetDate] = useState<number>();
	const [isRunning, setIsRunning] = useState(true);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const {isOpen, show, hide} = useModal();
	const {
		isOpen: isOpenSpacedOn,
		show: showSpacedOn,
		hide: hideSpacedOn,
	} = useModal();
	const {
		isOpen: isOpenSpacedOff,
		show: showSpacedOff,
		hide: hideSpacedOff,
	} = useModal();
	const router = useRouter();
	const {data: userData, mutate} = useSWR('/api/user', fetcher);
	const [user, setUser] = useState<User>();
	const [id, setId] = useState<string>();
	const [streak, setStreak] = useState<Streak>();
	const [previousStreak, setPreviousStreak] = useState<Streak>();
	const [shouldCheck, setShouldCheck] = useState<boolean>(false);
	const [leftBarStat, setLeftBarStat] = useState<Stat>();
	const [gradeLast, setGradeLast] = useState<number>();
	const [timeLast, setTimeLast] = useState<number>();

	useEffect(() => {
		if (!userData) return;
		if (!userData.success) return;

		setUser(() => userData.data);
		setId(() => userData.data._id.toString());
		setPreviousStreak(() => userData.data.streak);
	}, [userData]);

	useEffectAsync(async () => {
		if (!previousStreak || !id) return;

		const date = new Date();
		const today = formattedDate(date);

		// Check if we should increment or reset
		const {shouldIncrement, shouldReset} = shouldIncrementOrResetStreakCount(
			today,
			previousStreak.lastLoginDate,
		);

		let updatedStreak: Streak = previousStreak;
		if (shouldReset) updatedStreak = resetStreakCount(today);
		if (shouldIncrement)
			updatedStreak = incrementStreakCount(previousStreak, today);
		if (shouldReset || shouldIncrement)
			await updateStreak(id, {
				$set: {
					streak: updatedStreak,
				},
			});

		setStreak(() => updatedStreak);
	}, [previousStreak, id]);

	// For achievement
	const [streakMistakes, setStreakMistakes] = useState(0);
	const [streakTime, setStreakTime] = useState(0);
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationUrl, setNotificationUrl] = useState('');

	const cleanAnimation = useCallback(
		async () =>
			sleep(600)
				.then(() => {
					setAnimation(() => '');
				})
				.catch(console.error),
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[],
	);

	/**
	 * Extract the list of puzzles.
	 */
	useEffect(() => {
		setInitialSetTimer(() => set.currentTime);
		setInitialSetDate(() => Date.now());
		setCompletedPuzzles(() => set.progress);
		setTotalPuzzles(() => set.length);
		const puzzleList = set.puzzles.filter(p => !p.played);
		setPuzzleList(() => sortBy(puzzleList, 'order'));
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [set]);

	/**
	 * Retrieve current puzzle.
	 */
	useEffectAsync(async () => {
		if (!puzzleList[puzzleIndex] || puzzleList.length === 0) return;

		if (nextPuzzle) {
			setPuzzle(() => nextPuzzle);
		} else {
			const puzzleItem = puzzleList[puzzleIndex];
			const data = await get_.puzzle(puzzleItem.PuzzleId.toString());
			if (data.success) setPuzzle(() => data.data);
		}

		if (!puzzleList[puzzleIndex + 1] || puzzleList.length === 0) return;
		const nextPuzzleItem = puzzleList[puzzleIndex + 1];
		const dataNext = await get_.puzzle(nextPuzzleItem.PuzzleId.toString());
		if (dataNext.success) setNextPuzzle(() => dataNext.data);
	}, [puzzleList, puzzleIndex]);

	/**
	 * Setup the board.
	 */
	useEffect(() => {
		if (!puzzle?.Moves) return;
		const chess = new Chess(puzzle.FEN);
		setChess(() => chess);
		setMoveHistory(() => puzzle.Moves.split(' '));
		setMoveNumber(() => 0);
		setLastMove(() => []);
		setIsComplete(() => false);
		setPendingMove(() => undefined);
		setInitialPuzzleTimer(() => Date.now());
		setIsSolutionClicked(() => false);
		setOrientation(() => {
			if (isReverted) return chess.turn() === 'b' ? 'black' : 'white';
			return chess.turn() === 'b' ? 'white' : 'black';
		});

		const config: Partial<Config> = {
			fen: chess.fen(),
			check: chess.in_check(),
			animation: {enabled: true, duration: 50},
			turnColor: getColor(chess.turn()),
			highlight: {
				lastMove: true,
				check: true,
			},
			premovable: {enabled: false},
			movable: getMovable(chess),
			coordinates: true,
		};

		setConfig(previousConfig => ({...previousConfig, ...config}));
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [puzzle]);

	useEffectAsync(async () => {
		if (!shouldCheck) return;
		const timeTaken = (Date.now() - initialPuzzleTimer) / 1000;
		const timeWithoutMistakes = Number.parseInt(timeTaken.toFixed(2), 10);
		const body: AchivementsArgs = {
			streakMistakes,
			streakTime,
			completionTime: timeWithoutMistakes,
			completionMistakes: mistakes,
			totalPuzzleSolved: user.totalPuzzleSolved,
			themes: puzzle.Themes.map(t => {
				const a = user.puzzleSolvedByCategories.find(c => t === c.title);
				const count = a ? a.count + 1 : 1;
				return {title: t, count};
			}),
			streak,
			isSponsor: user.isSponsor,
		};

		checkForAchievement(body)
			.then(unlockedAchievements => {
				if (unlockedAchievements.length > 0) {
					setShowNotification(() => true);
					setNotificationMessage(() => 'Achievement unlocked!');
					setNotificationUrl(() => '/dashboard');
				}
			})
			.catch(console.error);

		setShouldCheck(() => false);
	}, [shouldCheck]);

	useEffect(() => {
		if (!puzzleList[puzzleIndex] || puzzleList.length === 0) return;
		const puzzleItem = puzzleList[puzzleIndex];
		setGradeLast(() => puzzleItem.grades[puzzleItem.grades.length - 1]);
		setTimeLast(() => puzzleItem.timeTaken[puzzleItem.timeTaken.length - 1]);
	}, [puzzleList, puzzleIndex]);

	/**
	 * Push the data of the current puzzle when complete.
	 */
	const updateFinishedPuzzle = useCallback(async () => {
		const {timeTaken, timeWithMistakes} = getTimeTaken(initialPuzzleTimer);
		const {maxTime, minTime} = getTimeInterval(moveHistory.length);
		setStreakMistakes(previous => (mistakes === 0 ? previous + 1 : 0));
		setStreakTime(previous => (timeTaken < 5 ? previous + 1 : 0));

		const puzzleItem = puzzleList[puzzleIndex];
		const newGrade = getGrade({
			didCheat: isSolutionClicked,
			mistakes,
			timeTaken,
			maxTime,
			minTime,
			streak: puzzleItem.streak,
		});

		setLeftBarStat(() => ({
			gradeCurrent: newGrade,
			timeCurrent: timeWithMistakes,
			gradeLast,
			timeLast,
		}));

		setPreviousPuzzle(previous => [
			...previous,
			{
				grade: newGrade,
				PuzzleId: puzzle.PuzzleId,
			},
		]);

		const update = {
			$inc: {
				'puzzles.$.count': 1,
				currentTime: timeWithMistakes,
				progress: 1,
			},
			$push: {
				'puzzles.$.mistakes': mistakes,
				'puzzles.$.timeTaken': timeTaken,
				'puzzles.$.grades': newGrade,
			},
			$set: {
				'puzzles.$.played': true,
			},
		};

		update.$inc['puzzles.$.streak'] = newGrade >= 5 ? 1 : 0;

		const userThemes = user.puzzleSolvedByCategories;
		const newThemes = puzzle.Themes;
		const {themesInCommon, themesNotInCommon} = getThemes({
			userThemes,
			newThemes,
		});

		const incUser: UpdateUser = {
			$inc: {totalPuzzleSolved: 1, totalTimePlayed: timeTaken},
		};
		const pushUser = {$push: {}};

		if (themesNotInCommon.length > 0)
			pushUser.$push = {
				puzzleSolvedByCategories: {
					$each: themesNotInCommon.map(title => ({title, count: 1})),
				},
			};

		if (themesInCommon.length > 0)
			for (const theme of themesInCommon)
				incUser.$inc[
					`puzzleSolvedByCategories.${userThemes.indexOf(theme)}.count`
				] = 1;

		setShouldCheck(() => true);
		Promise.all([
			update_.puzzle(set._id.toString(), puzzleItem._id.toString(), update),
			update_.user(user._id.toString(), pushUser),
			update_.user(user._id.toString(), incUser),
		])
			.then(async () => mutate())
			.catch(console.error);
	}, [
		puzzleIndex,
		puzzle,
		mistakes,
		puzzleList,
		initialPuzzleTimer,
		set._id,
		isSolutionClicked,
		mutate,
		user,
		moveHistory.length,
		gradeLast,
		timeLast,
	]);

	/**
	 * Called when puzzle is completed, switch to the next one.
	 */
	const changePuzzle = useCallback(async () => {
		await updateFinishedPuzzle();
		setCompletedPuzzles(previous => previous + 1);
		setMistakes(() => 0);
		setInitialPuzzleTimer(() => Date.now());
		setIsSolutionClicked(() => false);
		setPuzzleIndex(previousPuzzle => previousPuzzle + 1);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [updateFinishedPuzzle]);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedSet = useCallback(async () => {
		const {timeTaken} = getTimeTaken(initialSetDate);
		const totalTimeTaken = timeTaken + set.currentTime;
		const update = getUpdateBody.finishedSet(totalTimeTaken);
		await update_.set(set._id.toString(), update).catch(console.error);
	}, [initialSetDate, set]);

	/**
	 * Called after each correct move.
	 */
	const checkSetComplete = useCallback(async () => {
		if (puzzleIndex + 1 !== puzzleList.length) return;
		await audio('VICTORY', hasSound)
			.then(updateFinishedPuzzle)
			.then(updateFinishedSet)
			.then(showSpacedOn);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [
		puzzleIndex,
		hasSound,
		puzzleList.length,
		updateFinishedPuzzle,
		updateFinishedSet,
	]);

	/**
	 * Function making the computer play the next move.
	 */
	const computerMove = useCallback(
		async (index: number) => {
			if (!chess) return;
			const move = chess.move(moveHistory[index], {sloppy: true});
			if (!move) return;
			setConfig(config => ({
				...config,
				fen: chess.fen(),
				check: chess.in_check(),
				movable: getMovable(chess),
				turnColor: getColor(chess.turn()),
				lastMove: [move.from, move.to],
			}));
			setMoveNumber(previousMove => previousMove + 1);
			await (move.captured
				? audio('CAPTURE', hasSound)
				: audio('MOVE', hasSound));
		},
		[chess, moveHistory, hasSound],
	);

	const playFromComputer = useCallback(
		async (move: number) =>
			sleep(300)
				.then(async () => computerMove(move))
				.catch(console.error),
		[computerMove],
	);

	const checkChunkComplete = useCallback(async (): Promise<boolean> => {
		const isChunkComplete = completedPuzzles + 1 >= 20;
		if (!set.spacedRepetition || !isChunkComplete) return false;
		await updateSpacedRepetition(set, showSpacedOff);
		router.reload();
		return true;
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [completedPuzzles, set]);

	/**
	 * Called after each correct move.
	 */
	const checkPuzzleComplete = useCallback(
		async moveNumber => {
			const isComplete = moveNumber === moveHistory.length;
			if (hasAnimation) {
				const animation = isComplete
					? 'animate-finishMove'
					: 'animate-rightMove';
				setAnimation(() => animation);
				cleanAnimation().catch(console.error);
			}

			if (!isComplete) return playFromComputer(moveNumber);
			if (set.spacedRepetition) await checkChunkComplete();
			if (!set.spacedRepetition) await checkSetComplete();

			setIsComplete(() => true);

			await audio('GENERIC', hasSound, 0.3);
			if (hasAutoMove) return changePuzzle();
			setIsRunning(() => false);
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[
			hasAutoMove,
			hasSound,
			changePuzzle,
			checkChunkComplete,
			checkSetComplete,
			cleanAnimation,
			playFromComputer,
			moveHistory.length,
		],
	);

	/**
	 * When the board is setup, make the first move.
	 */
	useEffect(() => {
		if (!moveHistory) return;
		if (moveNumber !== 0) return;
		playFromComputer(0).catch(console.error);
	}, [moveHistory, moveNumber, playFromComputer]);

	useEffect(() => {
		setConfig(config => ({...config, lastMove}));
	}, [lastMove]);

	const onRightMove = useCallback(
		async (from: Square, to: Square) => {
			setConfig(config => ({
				...config,
				fen: chess.fen(),
				check: chess.in_check(),
				turnColor: getColor(chess.turn()),
				movable: getMovable(chess),
				lastMove: [from, to],
			}));
			const currentMoveNumber = moveNumber + 1;
			setMoveNumber(previousMove => previousMove + 1);
			await checkPuzzleComplete(currentMoveNumber);
		},
		[chess, moveNumber, checkPuzzleComplete],
	);

	const onWrongMove = useCallback(async () => {
		chess.undo();
		setMistakes(previous => previous + 1);
		setTotalMistakes(previous => previous + 1);
		if (hasAnimation) {
			setAnimation(() => 'animate-wrongMove');
			cleanAnimation().catch(console.error);
		}

		await audio('ERROR', hasSound);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [chess, hasSound, cleanAnimation]);

	/**
	 * Function called when the user plays.
	 */
	const onMove = useCallback(
		async (from: Square, to: Square) => {
			const moves = chess.moves({verbose: true});
			for (const move_ of moves) {
				if (
					move_.from === from &&
					move_.to === to &&
					move_.flags.includes('p')
				) {
					setPendingMove([from, to]);
					show();
					return;
				}
			}

			const move = chess.move({from, to});
			if (move === null) return;

			await (move.captured
				? audio('CAPTURE', hasSound)
				: audio('MOVE', hasSound));

			const isCorrectMove =
				`${move.from}${move.to}` === moveHistory[moveNumber];
			if (isCorrectMove || chess.in_checkmate()) {
				await onRightMove(from, to);
				return;
			}

			await onWrongMove();
		},
		[chess, moveHistory, moveNumber, onRightMove, onWrongMove, hasSound, show],
	);

	/**
	 * Handle promotions via chessground.
	 */
	const promotion = useCallback(
		async (piece: ShortMove['promotion']) => {
			const from = pendingMove[0];
			const to = pendingMove[1];
			const isCorrectMove = piece === moveHistory[moveNumber].slice(-1);
			const move = chess.move({from, to, promotion: piece});
			if (move === null) return;

			await (move.captured
				? audio('CAPTURE', hasSound)
				: audio('MOVE', hasSound));

			if (isCorrectMove || chess.in_checkmate()) {
				await onRightMove(from, to);
				return;
			}

			await onWrongMove();
		},
		[
			pendingMove,
			moveHistory,
			moveNumber,
			chess,
			hasSound,
			onRightMove,
			onWrongMove,
		],
	);

	const fn = useCallback(async () => {
		if (!isComplete) return;
		await changePuzzle();
	}, [isComplete, changePuzzle]);

	const launchTimer = useCallback(() => {
		setIsRunning(() => true);
	}, []);

	useKeyPress({targetKey: 'Q', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 'q', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 'Escape', fn: async () => router.push('/dashboard')});
	useKeyPress({targetKey: 's', fn});
	useKeyPress({targetKey: 'S', fn});
	useKeyPress({targetKey: 'n', fn});
	useKeyPress({targetKey: 'N', fn});

	return (
		<>
			<NextSeo title='⚔️ Play' />
			<ModalSpacedEnd isOpen={isOpenSpacedOff} hide={hideSpacedOff} />
			<ModalSpacedOn
				isOpen={isOpenSpacedOn}
				hide={hideSpacedOn}
				onClick={async () => {
					await activateSpacedRepetion(set);
					hideSpacedOn();
					router.reload();
				}}
			/>
			<div className='flex flex-col justify-start w-screen min-h-screen pt-32 pb-24 m-0 text-slate-800'>
				<div className='flex flex-row justify-center gap-2'>
					{hasClock && (
						<Timer
							value={initialSetTimer}
							mistakes={totalMistakes}
							isRunning={isRunning}
						/>
					)}
					<Link href='/dashboard'>
						<a>
							<Button className='items-center my-2 leading-8 bg-gray-800 rounded-md w-36'>
								LEAVE 🧨
							</Button>
						</a>
					</Link>
				</div>
				<div className='flex flex-col items-center justify-center w-full md:flex-row'>
					<LeftBar stat={leftBarStat} />
					<div className='max-w-[33rem] w-11/12 md:w-full flex-auto'>
						<Board
							config={{...config, orientation, events: {move: onMove}}}
							isOpen={isOpen}
							hide={hide}
							color={getColor(chess.turn())}
							onPromote={promotion}
						/>

						<BottomBar puzzles={previousPuzzle} />
					</div>
					<RightBar
						fen={chess.fen()}
						puzzle={puzzle}
						hasSpacedRepetition={set.spacedRepetition}
						answer={moveHistory[moveNumber]}
						changePuzzle={changePuzzle}
						launchTimer={launchTimer}
					/>
				</div>
			</div>
			<Notification
				text={notificationMessage}
				isVisible={showNotification}
				url={notificationUrl}
				setShow={setShowNotification}
			/>
		</>
	);
};

PlayingPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default PlayingPage;

interface SSRProps extends GetServerSidePropsContext {
	params: {id: string | undefined};
}

export const getServerSideProps = withSessionSsr(
	async ({params, req}: SSRProps) => {
		if (!req?.session?.userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		const id: string = params.id;
		const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
		const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
		const result = await get_.set(id, baseUrl);
		if (!result.success) return {notFound: true};
		/* eslint-disable-next-line @typescript-eslint/no-base-to-string */
		if (result.data.user.toString() !== req.session.userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/dashboard'};
			return {redirect};
		}

		return {props: {set: result.data}};
	},
);
