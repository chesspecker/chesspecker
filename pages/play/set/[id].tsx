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
import {formattedDate, groupBy, sleep, sortBy} from '@/lib/utils';
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
import Timer from '@/components/play/timer';
import {ThemeItem} from '@/models/theme';

const Notification = dynamic(async () => import('@/components/notification'));
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
	const [puzzle, setPuzzle] = useState<Puzzle>();
	const [nextPuzzle, setNextPuzzle] = useState<Puzzle>();
	const [puzzleIndex, setPuzzleIndex] = useState(0);
	const [newGrade, setNewGrade] = useState(0);
	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [previousPuzzle, setPreviousPuzzle] = useState<PreviousPuzzle[]>([]);
	const [totalMistakes, setTotalMistakes] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [timeTaken, setTimeTaken] = useState(0);
	const [timeWithMistakes, setTimeWithMistakes] = useState(0);
	const [initialSetDate, setInitialSetDate] = useState<number>();
	const [isRunning, setIsRunning] = useState(true);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const [leftBarStat, setLeftBarStat] = useState<Stat>();
	const [streakMistakes, setStreakMistakes] = useState(0);
	const [streakTime, setStreakTime] = useState(0);
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationUrl, setNotificationUrl] = useState('');
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

	const retrieveCurrentPuzzle = useCallback(() => {
		if (!puzzleItemList[puzzleIndex] || puzzleItemList.length === 0) return;
		const item = puzzleItemList[puzzleIndex];
		if (nextPuzzle?.PuzzleId === item.PuzzleId) {
			console.log('🟣 using cached puzzle:', item.PuzzleId);
			setPuzzle(() => nextPuzzle);
		} else {
			console.log('🔵 fetching puzzle:', item.PuzzleId);
			fetch(`/api/puzzle/${item.PuzzleId}`)
				.then(async response => response.json() as Promise<PuzzleData>)
				.then(request => {
					console.log('🟢 fetched puzzle:', item.PuzzleId);
					if (request.success) setPuzzle(() => request.data);
				})
				.catch(console.error);
		}

		if (!puzzleItemList[puzzleIndex + 1]) return;
		const item2 = puzzleItemList[puzzleIndex + 1];
		console.log('🔵 fetching next puzzle:', item2.PuzzleId);
		fetch(`/api/puzzle/${item2.PuzzleId}`)
			.then(async response => response.json() as Promise<PuzzleData>)
			.then(request => {
				console.log('🟢 fetched next puzzle:', item2.PuzzleId);
				if (request.success) setNextPuzzle(() => request.data);
			})
			.catch(console.error);
	}, [puzzleItemList, puzzleIndex, nextPuzzle]);

	/**
	 * Extract the list of puzzles.
	 */
	const [previous, setPrevious] = useState<PuzzleSet>();
	if (set !== previous) {
		setPrevious(set);
		setCompletedPuzzles(() => set.progress);
		setTotalPuzzles(() => set.length);
		setInitialSetDate(() => Date.now());
		setPuzzleItemList(() =>
			sortBy(
				set.puzzles.filter(p => !p.played),
				'order',
			),
		);
	}

	useEffect(() => {
		if (!puzzleItemList) return;
		retrieveCurrentPuzzle();
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [puzzleItemList, puzzleIndex]);

	/**
	 * Setup the board.
	 */
	useEffect(() => {
		if (!puzzle) return;
		const chess = new Chess(puzzle.FEN);
		setChess(() => chess);
		setMoveHistory(() => puzzle.Moves.split(' '));
		setMoveNumber(() => 0);
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
			lastMove: [],
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

	const handleCheckAchievements = useCallback(
		async ({
			streakMistakes_,
			streakTime_,
		}: {
			streakMistakes_: number;
			streakTime_: number;
		}) => {
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
			puzzle,
		],
	);

	/**
	 * Push the data of the current puzzle when complete.
	 */
	const updateFinishedPuzzle = useCallback(async () => {
		if (!puzzle || !user) return;
		const streakMistakes_ = mistakes === 0 ? streakMistakes + 1 : 0;
		const streakTime_ = timeTaken < 5 ? streakTime + 1 : 0;
		setStreakMistakes(() => streakMistakes_);
		setStreakTime(() => streakTime_);

		setPreviousPuzzle(previous => [
			...previous,
			{
				grade: newGrade,
				PuzzleId: puzzle.PuzzleId,
			},
		]);

		const updatePuzzleSet = {
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

		updatePuzzleSet.$inc['puzzles.$.streak'] = newGrade >= 5 ? 1 : 0;

		const groupedArray = groupBy<ThemeItem>(
			puzzleSolvedByCategories,
			v => v.title,
		);

		const puzzleSolvedByCategories_: ThemeItem[] = Object.keys(
			groupedArray,
		).map(key => ({
			title: key,
			count: groupedArray[key].reduce(
				(previous_: number, {count}) => previous_ + count,
				0,
			),
		}));

		const userThemes = puzzleSolvedByCategories_;
		const newThemes = puzzle.Themes;
		const {themesInCommon, themesNotInCommon} = getThemes({
			userThemes,
			newThemes,
		});

		if (themesNotInCommon.length > 0)
			puzzleSolvedByCategories_.push(
				...themesNotInCommon.map(title => ({title, count: 1})),
			);

		if (themesInCommon.length > 0)
			for (const theme of themesInCommon) {
				const currentTheme =
					puzzleSolvedByCategories_[
						puzzleSolvedByCategories_.indexOf(
							puzzleSolvedByCategories_.find(
								value => value.title === theme.title,
							)!,
						)
					];

				currentTheme.count += 1;
			}

		const updateUser = {
			$inc: {totalPuzzleSolved: 1, totalTimePlayed: timeTaken},
			$set: {
				puzzleSolvedByCategories: puzzleSolvedByCategories_,
			},
		};

		setPuzzleSolvedByCategories(() => puzzleSolvedByCategories_);
		setTotalPuzzleSolved(previous => previous + 1);

		Promise.all([
			update_.puzzle(
				set._id.toString(),
				puzzleItemList[puzzleIndex]._id.toString(),
				updatePuzzleSet,
			),
			update_.user(user._id.toString(), updateUser),
		])
			.then(async () => handleCheckAchievements({streakMistakes_, streakTime_}))
			.catch(console.error);
	}, [
		handleCheckAchievements,
		newGrade,
		streakMistakes,
		streakTime,
		timeTaken,
		timeWithMistakes,
		puzzleIndex,
		mistakes,
		puzzleItemList,
		set._id,
		puzzle,
		user,
		puzzleSolvedByCategories,
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

			const {maxTime, minTime} = getTimeInterval(moveHistory.length);
			const {timeTaken, timeWithMistakes} = getTimeTaken(initialPuzzleTimer);
			const puzzleItem = puzzleItemList[puzzleIndex];

			const newGrade = getGrade({
				didCheat: isSolutionClicked,
				mistakes,
				timeTaken,
				maxTime,
				minTime,
				streak: puzzleItem.streak,
			});

			setNewGrade(() => newGrade);

			setLeftBarStat(() => ({
				gradeCurrent: newGrade,
				timeCurrent: timeWithMistakes,
				gradeLast: puzzleItem.grades[puzzleItem.grades.length - 1],
				timeLast: puzzleItem.timeTaken[puzzleItem.timeTaken.length - 1],
			}));
			setTimeTaken(() => timeTaken);
			setTimeWithMistakes(() => timeWithMistakes);
			if (hasAutoMove) return changePuzzle();
			setIsRunning(() => false);
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[
			hasAutoMove,
			hasAnimation,
			hasSound,
			changePuzzle,
			checkChunkComplete,
			checkSetComplete,
			cleanAnimation,
			playFromComputer,
			moveHistory.length,
			initialPuzzleTimer,
			isSolutionClicked,
			mistakes,
			playGeneric,
			puzzleIndex,
			puzzleItemList,
			set.spacedRepetition,
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
							value={set.currentTime}
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
