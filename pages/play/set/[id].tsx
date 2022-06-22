import {useState, useEffect, useCallback, ReactElement} from 'react';
import * as ChessJS from 'chess.js';
import {ChessInstance, Square, ShortMove} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useSound} from 'use-sound';
import MOVE from '@/sounds/Move.mp3';
import CAPTURE from '@/sounds/Capture.mp3';
import ERROR from '@/sounds/Error.mp3';
import GENERIC from '@/sounds/GenericNotify.mp3';
import VICTORY from '@/sounds/Victory.mp3';
import {AchivementsArgs} from '@/types/models';
import Layout from '@/layouts/main';
import {formattedDate, sleep, sortBy} from '@/lib/utils';
import useEffectAsync from '@/hooks/use-effect-async';
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
	getColor,
} from '@/lib/play';
import LeftBar, {Stat} from '@/components/play/left-bar';
import {Streak} from '@/models/streak';
import Board from '@/components/play/board';
import RightBar from '@/components/play/right-bar';
import {PuzzleData} from '@/pages/api/puzzle/[id]';
import {ThemeItem} from '@/models/theme';

const Notification = dynamic(async () => import('@/components/notification'));
const Timer = dynamic(async () => import('@/components/play/timer'));
const BottomBar = dynamic(async () => import('@/components/play/bottom-bar'));
const ModalSpacedOn = dynamic(
	async () => import('@/components/play/modal-spaced-on'),
);
const ModalSpacedEnd = dynamic(
	async () => import('@/components/play/modal-spaced-end'),
);

const Chess = typeof ChessJS === 'function' ? ChessJS : ChessJS.Chess;

type Props = {set: PuzzleSet; user: User};
const PlayingPage = ({set, user}: Props) => {
	const [playMove] = useSound(MOVE);
	const [playCapture] = useSound(CAPTURE);
	const [playError] = useSound(ERROR);
	const [playGeneric] = useSound(GENERIC, {volume: 0.3});
	const [playVictory] = useSound(VICTORY);
	const router = useRouter();
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
	const [puzzleItemList, setPuzzleItemList] = useState<PuzzleItem[]>([]);
	const [puzzleList, setPuzzleList] = useState<Record<string, Puzzle>>({});
	const [currentPuzzle, setCurrentPuzzle] = useState<string>();
	const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
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
	const [leftBarStat, setLeftBarStat] = useState<Stat>();
	const [streakMistakes, setStreakMistakes] = useState(0);
	const [streakTime, setStreakTime] = useState(0);
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationUrl, setNotificationUrl] = useState('');
	const [shouldReturn, setShouldReturn] = useState(false);
	const [totalPuzzleSolved, setTotalPuzzleSolved] = useState(
		user.totalPuzzleSolved,
	);
	const [puzzleSolvedByCategories, setPuzzleSolvedByCategories] = useState(
		user.puzzleSolvedByCategories,
	);
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
		const sortedList = sortBy(puzzleList, 'order');
		setPuzzleItemList(() => sortedList);
		setCurrentPuzzle(() => sortedList[0].PuzzleId);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [set]);

	useEffectAsync(async () => {
		const abortController = new AbortController();
		const {signal} = abortController;

		const aborting = () => {
			abortController.abort();
		};

		router.events.on('routeChangeStart', aborting);

		const requests: Array<Promise<PuzzleData>> = [];
		for (const item of puzzleItemList) {
			requests.push(
				fetch(`/api/puzzle/${item.PuzzleId}`, {signal}).then(async response =>
					response.json(),
				),
			);
		}

		requests.map(async promise => {
			const puzzleData = await promise;
			if (puzzleData.success) {
				setPuzzleList(previous => ({
					...previous,
					[puzzleData.data.PuzzleId]: puzzleData.data,
				}));
			}
		});

		return () => {
			router.events.off('routeChangeStart', aborting);
		};
	}, [puzzleItemList]);

	/**
	 * Setup the board.
	 */
	useEffect(() => {
		if (!currentPuzzle || shouldReturn) return;
		const puzzle = puzzleList[currentPuzzle];
		if (!puzzle) return;
		setShouldReturn(() => true);
		const chess = new Chess(puzzle.FEN);
		setChess(() => chess);
		setMoveHistory(() => puzzle.Moves.split(' '));
		setMoveNumber(() => 0);
		setLastMove(() => []);
		setIsComplete(() => false);
		setPendingMove(() => []);
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
	}, [currentPuzzle, puzzleList]);

	const handleCheckAchievements = useCallback(
		async ({
			streakMistakes_,
			streakTime_,
		}: {
			streakMistakes_: number;
			streakTime_: number;
		}) => {
			if (!currentPuzzle) return;
			const puzzle = puzzleList[currentPuzzle];
			if (!puzzle) return;
			const date = formattedDate(new Date());

			// Check if we should increment or reset
			const {shouldIncrement, shouldReset} = shouldIncrementOrResetStreakCount(
				date,
				user.streak.lastLoginDate,
			);

			let updatedStreak: Streak = user.streak;
			if (shouldReset) updatedStreak = resetStreakCount(date);

			if (shouldIncrement)
				updatedStreak = incrementStreakCount(user.streak, date);

			if (shouldReset || shouldIncrement) {
				await updateStreak(user._id.toString(), {
					$set: {
						streak: updatedStreak,
					},
				});
			}

			const timeTaken = (Date.now() - initialPuzzleTimer) / 1000;
			const timeWithoutMistakes = Number.parseInt(timeTaken.toFixed(2), 10);
			const body: AchivementsArgs = {
				streakMistakes: streakMistakes_,
				streakTime: streakTime_,
				completionTime: timeWithoutMistakes,
				completionMistakes: mistakes,
				totalPuzzleSolved,
				themes: puzzle.Themes.map(t => {
					const a = puzzleSolvedByCategories.find(c => t === c.title);
					const count = a ? a.count + 1 : 1;
					return {title: t, count};
				}),
				streak: updatedStreak,
				isSponsor: user.isSponsor,
			};

			checkForAchievement(body)
				.then(unlockedAchievements => {
					if (!unlockedAchievements) return;
					if (unlockedAchievements.length > 0) {
						setShowNotification(() => true);
						setNotificationMessage(() => 'Achievement unlocked!');
						setNotificationUrl(() => '/dashboard');
					}
				})
				.catch(console.error);
		},
		[
			puzzleSolvedByCategories,
			initialPuzzleTimer,
			mistakes,
			user,
			totalPuzzleSolved,
			currentPuzzle,
			puzzleList,
		],
	);

	/**
	 * Push the data of the current puzzle when complete.
	 */
	const updateFinishedPuzzle = useCallback(async () => {
		if (!currentPuzzle) return;
		const puzzle = puzzleList[currentPuzzle];
		if (!puzzle || !user) return;
		const {timeTaken, timeWithMistakes} = getTimeTaken(initialPuzzleTimer);
		const {maxTime, minTime} = getTimeInterval(moveHistory.length);
		const streakMistakes_ = mistakes === 0 ? streakMistakes + 1 : 0;
		const streakTime_ = timeTaken < 5 ? streakTime + 1 : 0;
		setStreakMistakes(() => streakMistakes_);
		setStreakTime(() => streakTime_);

		const puzzleItem = puzzleItemList[puzzleIndex];
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
			gradeLast: puzzleItem.grades[puzzleItem.grades.length - 1],
			timeLast: puzzleItem.timeTaken[puzzleItem.timeTaken.length - 1],
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
				'puzzles.$.streak': 0,
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

		const puzzleSolvedByCategories_: ThemeItem[] = [];
		const userThemes = puzzleSolvedByCategories;
		const newThemes = puzzle.Themes;
		const {themesInCommon, themesNotInCommon} = getThemes({
			userThemes,
			newThemes,
		});

		const incUser: UpdateUser = {
			$inc: {totalPuzzleSolved: 1, totalTimePlayed: timeTaken},
		};
		const pushUser = {$push: {}};

		if (themesNotInCommon.length > 0) {
			pushUser.$push = {
				puzzleSolvedByCategories: {
					$each: themesNotInCommon.map(title => ({title, count: 1})),
				},
			};
			puzzleSolvedByCategories_.push(
				...themesNotInCommon.map(title => ({title, count: 1})),
			);
		}

		if (themesInCommon.length > 0)
			for (const theme of themesInCommon) {
				// @ts-expect-error Can't index type any
				incUser.$inc[
					`puzzleSolvedByCategories.${userThemes.indexOf(theme)}.count`
				] = 1;
				puzzleSolvedByCategories_.push({
					title: theme.title,
					count: theme.count + 1,
				});
			}

		setPuzzleSolvedByCategories(() => puzzleSolvedByCategories_);
		setShouldReturn(() => false);
		setCurrentPuzzle(() => puzzleItemList[puzzleIndex + 1].PuzzleId);
		setTotalPuzzleSolved(previous => previous + 1);

		Promise.all([
			update_.puzzle(set._id.toString(), puzzleItem._id.toString(), update),
			update_.user(user._id.toString(), pushUser),
			update_.user(user._id.toString(), incUser),
		])
			.then(async () => handleCheckAchievements({streakMistakes_, streakTime_}))
			.catch(console.error);
	}, [
		handleCheckAchievements,
		streakMistakes,
		streakTime,
		puzzleIndex,
		mistakes,
		puzzleItemList,
		initialPuzzleTimer,
		set._id,
		isSolutionClicked,
		user,
		currentPuzzle,
		puzzleSolvedByCategories,
		puzzleList,
		moveHistory.length,
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
		if (!initialSetDate) return;
		const {timeTaken} = getTimeTaken(initialSetDate);
		const totalTimeTaken = timeTaken + set.currentTime;
		const update = getUpdateBody.finishedSet(totalTimeTaken);
		await update_.set(set._id.toString(), update).catch(console.error);
	}, [initialSetDate, set]);

	/**
	 * Called after each correct move.
	 */
	const checkSetComplete = useCallback(async () => {
		if (puzzleIndex + 1 !== puzzleItemList.length) return;
		if (hasSound) playVictory();
		await updateFinishedPuzzle().then(updateFinishedSet).then(showSpacedOn);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [
		puzzleIndex,
		hasSound,
		puzzleItemList.length,
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
			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();
		},
		[chess, moveHistory, hasSound, playCapture, playMove],
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

			if (hasSound) playGeneric();
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

		if (hasSound) playError();
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

			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();

			const isCorrectMove =
				`${move.from}${move.to}` === moveHistory[moveNumber];
			if (isCorrectMove || chess.in_checkmate()) {
				await onRightMove(from, to);
				return;
			}

			await onWrongMove();
		},
		[
			chess,
			moveHistory,
			moveNumber,
			onRightMove,
			onWrongMove,
			hasSound,
			show,
			playCapture,
			playMove,
		],
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

			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();

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
			playCapture,
			playMove,
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
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							config={{...config, orientation, events: {move: onMove as any}}}
							isOpen={isOpen}
							hide={hide}
							color={getColor(chess.turn())}
							onPromote={promotion}
						/>

						<BottomBar puzzles={previousPuzzle} />
					</div>
					<RightBar
						fen={chess.fen()}
						puzzle={puzzleList[currentPuzzle ?? '']}
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

export const getServerSideProps = withSessionSsr(
	async ({params, req}: GetServerSidePropsContext) => {
		const {userID} = req.session;
		if (!userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		const id = params?.id as string | undefined;
		if (!id) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
		const baseUrl = req ? `${protocol}://${req.headers.host!}` : '';

		const setResponse = await get_.set(id, baseUrl);
		if (!setResponse.success) return {notFound: true};
		if (setResponse.data.user?.toString() !== userID) {
			const redirect: Redirect = {statusCode: 303, destination: '/dashboard'};
			return {redirect};
		}

		const userResponse = await get_.user(userID, baseUrl);
		if (!userResponse.success) return {notFound: true};

		return {props: {set: setResponse.data, user: userResponse.data}};
	},
);
