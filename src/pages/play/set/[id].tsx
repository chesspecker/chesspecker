/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import type {ReactElement} from 'react';
import {useState, useEffect, useCallback, useRef} from 'react';
import type {Move, Square} from 'chess.js';
import {Chess} from 'chess.js';
import type {Config} from 'chessground/config';
import {useAtom, useSetAtom} from 'jotai';
import {useRouter} from 'next/router';
import type {GetServerSidePropsContext, Redirect} from 'next';
import {NextSeo} from 'next-seo';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useSound} from 'use-sound';
import type {
	PuzzleSet,
	User,
	PuzzleItem,
	Puzzle,
	ThemeItem,
	Theme,
} from '@prisma/client';
import type {Animation} from '@/types/animation';
import {Button} from '@/components/button';
import {withSessionSsr} from '@/lib/session';
import type {PreviousPuzzle} from '@/components/play/bottom-bar/history';
import {getGrade} from '@/lib/grades';
import type {Stat} from '@/components/play/left-bar';
import LeftBar from '@/components/play/left-bar';
import Board from '@/components/play/board';
import RightBar from '@/components/play/right-bar';
import Timer from '@/components/play/timer';
import BottomBar from '@/components/play/bottom-bar';
import VICTORY from '@/sounds/Victory.mp3';
import GENERIC from '@/sounds/GenericNotify.mp3';
import ERROR from '@/sounds/Error.mp3';
import CAPTURE from '@/sounds/Capture.mp3';
import MOVE from '@/sounds/Move.mp3';
import {configµ} from '@/atoms/chessground';
import {useEffectAsync} from '@/hooks/use-effect-async';
import {useModal} from '@/hooks/use-modal';
import {Layout} from '@/layouts/main';
import {prisma} from '@/server/db';
import {animationµ, orientationµ, playµ} from '@/atoms/play';
import {useKeyPress} from '@/hooks/use-key-press';
import {
	getCurrentPuzzle,
	getColor,
	getMovable,
	getUpdateBody,
	getTime,
} from '@/lib/play';
import {sortBy} from '@/utils/sort-by';
import {api} from '@/utils/api';
import {getCheckAchivementBody, checkForAchievement} from '@/lib/achievements';

const Notification = dynamic(async () => import('@/components/notification'));
const ModalSpacedOn = dynamic(
	async () => import('@/components/play/modal-spaced-on'),
);
const ModalSpacedEnd = dynamic(
	async () => import('@/components/play/modal-spaced-end'),
);

type Props = {
	user?: User & {
		puzzleSolvedByCategories: ThemeItem[];
	};
	puzzleSet: PuzzleSet & {
		puzzles: Array<
			PuzzleItem & {
				themes: Theme[];
			}
		>;
	};
};

const PlayingPage = ({user, puzzleSet}: Props) => {
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
	const setTotalPuzzles = useSetAtom(playµ.totalPuzzles);
	const [isComplete, setIsComplete] = useAtom(playµ.isComplete);
	const [completedPuzzles, setCompletedPuzzles] = useAtom(playµ.completed);

	const [orientation, setOrientation] = useAtom(orientationµ.color);
	const [isReverted] = useAtom(orientationµ.reverted);
	const [, setAnimation] = useAtom(animationµ);

	const [chess, setChess] = useState<Chess>(new Chess());
	const [config, setConfig] = useState<Partial<Config>>();
	const [puzzle, setPuzzle] = useState<Puzzle>();

	const [nextPuzzle, setNextPuzzle] = useState<Puzzle>();
	const [puzzleIndex, setPuzzleIndex] = useState(0);
	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [previousPuzzle, setPreviousPuzzle] = useState<PreviousPuzzle[]>([]);
	const [totalMistakes, setTotalMistakes] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const initialSetDate = useRef<number>(Date.now());
	const [isRunning, setIsRunning] = useState(false);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const [leftBarStat, setLeftBarStat] = useState<Stat>();
	const [streakData, setStreakData] = useState({mistakes: 0, time: 0});

	const set = useRef(null);
	const puzzleItemList = useRef<PuzzleItem[]>(null);
	const [puzzleId, setPuzzleId] = useState(null);
	const [showNotification, setShowNotification] = useState(false);
	const [notificationData, setNotificationData] = useState({
		message: '',
		url: '',
	});
	const [totalPuzzleSolved, setTotalPuzzleSolved] = useState(
		user?.totalPuzzleSolved,
	);
	const [puzzleSolvedByCategories, setPuzzleSolvedByCategories] = useState(
		user?.puzzleSolvedByCategories,
	);
	const {
		isOpen: isOpenPromotion,
		show: showPromotion,
		hide: hidePromotion,
	} = useModal();
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

	const toggleAnimation = useCallback(
		async (animationString: Animation) => {
			setAnimation(() => animationString);
			await sleep(600);
			setAnimation(() => '');
		},
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[],
	);

	/**
	 * Extract the list of puzzles.
	 */
	useEffect(() => {
		setCompletedPuzzles(() => set.current.progress);
		setTotalPuzzles(() => set.current.length);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, []);

	const retrieveCurrentPuzzle = useCallback(getCurrentPuzzle, [
		puzzleItemList,
		puzzleIndex,
		nextPuzzle,
	]);

	useEffect(() => {
		if (!puzzleItemList) return;
		retrieveCurrentPuzzle({
			puzzleItemList,
			puzzleIndex,
			nextPuzzle,
			setPuzzle,
			setNextPuzzle,
		});
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [puzzleItemList, puzzleIndex]);

	/**
	 * Setup the board when we move to a new puzzle
	 */
	useEffect(() => {
		if (!puzzle) return;
		const chess = new Chess(puzzle.fen);
		setChess(() => chess);
		setMoveHistory(() => puzzle.moves);
		setMoveNumber(() => 0);
		setIsComplete(() => false);
		setPendingMove(() => []);
		setInitialPuzzleTimer(() => Date.now());
		setIsRunning(() => true);
		setIsSolutionClicked(() => false);
		setOrientation(() => {
			if (isReverted) return chess.turn() === 'b' ? 'black' : 'white';
			return chess.turn() === 'b' ? 'white' : 'black';
		});

		const config: Partial<Config> = {
			fen: chess.fen(),
			check: chess.isCheck(),
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
		({
			streakMistakes_,
			streakTime_,
		}: {
			streakMistakes_: number;
			streakTime_: number;
		}) => {
			if (!puzzle) return;
			const body = getCheckAchivementBody({
				user,
				puzzle,
				puzzleSolvedByCategories,
				initialPuzzleTimer,
				totalPuzzleSolved,
				streakMistakes: streakMistakes_,
				streakTime: streakTime_,
				completionMistakes: mistakes,
			});

			if (!body) return;

			checkForAchievement(body)
				.then(unlockedAchievements => {
					if (!unlockedAchievements || unlockedAchievements.length <= 0) return;
					setShowNotification(() => true);
					setNotificationData(() => ({
						message: 'Achievement unlocked!',
						url: '/dashboard',
					}));
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

	const updateBoard = useCallback((from: Square, to: Square, chess: Chess) => {
		setConfig(config => ({
			...config,
			fen: chess.fen(),
			check: chess.inCheck(),
			movable: getMovable(chess),
			turnColor: getColor(chess.turn()),
			lastMove: [from, to],
		}));
	}, []);

	/**
	 * Push the data of the current puzzle when complete.
	 */
	const updatePuzzleInDb = useCallback(
		(currentGrade: number, timeTaken: number, timeWithMistakes: number) => {
			if (!puzzle || !user) return;
			const streakMistakes_ = mistakes === 0 ? streakData.mistakes + 1 : 0;
			const streakTime_ = timeTaken < 5 ? streakData.time + 1 : 0;
			setStreakData(() => ({mistakes: streakMistakes_, time: streakTime_}));

			const updatePuzzleSet = getUpdateBody.puzzle({
				currentTime: timeWithMistakes,
				mistakes,
				timeTaken,
				currentGrade,
			});

			updatePuzzleSet.$inc['puzzles.$.streak'] = currentGrade >= 5 ? 1 : 0;

			const puzzleSolvedByCategories_ = getUpdateBody.categories(
				puzzleSolvedByCategories,
				puzzle.themes,
			);

			const updateUser = {
				$inc: {totalPuzzleSolved: 1, totalTimePlayed: timeTaken},
				$set: {puzzleSolvedByCategories: puzzleSolvedByCategories_},
			};

			setPuzzleSolvedByCategories(() => puzzleSolvedByCategories_);
			setTotalPuzzleSolved(previous => previous + 1);
			handleCheckAchievements({streakMistakes_, streakTime_});
			Promise.all([
				update_.puzzle(
					set.current.id,
					puzzleItemList[puzzleIndex]!.id,
					updatePuzzleSet,
				),
				update_.user(user.id, updateUser),
			]).catch(console.error);
		},
		[
			handleCheckAchievements,
			mistakes,
			puzzle,
			puzzleIndex,
			puzzleItemList,
			puzzleSolvedByCategories,
			set.current?.id,
			streakData.mistakes,
			streakData.time,
			user,
		],
	);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateSetInDb = useCallback(
		async (initialSetDate: number) => {
			const {timeTaken} = getTime.taken(initialSetDate);
			const totalTimeTaken = timeTaken + set.current.currentTime;
			const update = getUpdateBody.set({timeTaken: totalTimeTaken});
			await update_.set(set.current.id, update).catch(console.error);
		},
		[set.current?.id, set.current?.currentTime],
	);

	const handleSetComplete = useCallback(() => {
		if (hasSound) playVictory();
		showSpacedOn();
	}, [hasSound, playVictory, showSpacedOn]);

	const handleChunkComplete = useCallback(async () => {
		await updateSpacedRep(set, showSpacedOff);
		router.reload();
	}, [set, showSpacedOff, router]);

	/**
	 * Called when puzzle is completed, switch to the next one.
	 */
	const changePuzzle = useCallback(() => {
		if (!isComplete) return;
		setCompletedPuzzles(previous => previous + 1);
		setMistakes(() => 0);
		setIsSolutionClicked(() => false);
		setInitialPuzzleTimer(() => Date.now());
		setPuzzleIndex(previousPuzzle => previousPuzzle + 1);
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isComplete]);

	useEffect(() => {
		if (isComplete && hasAutoMove) changePuzzle();
	}, [isComplete, hasAutoMove, changePuzzle]);

	const handlePuzzleComplete = useCallback(
		(currentGrade: number, timeWithMistakes: number) => {
			const puzzleItem = puzzleItemList[puzzleIndex];
			if (puzzleItem === undefined) return;
			setPreviousPuzzle(previous => [
				...previous,
				{
					grade: currentGrade,
					lichessId: puzzleItem.lichessId,
				},
			]);

			setLeftBarStat(() => ({
				currentGrade,
				timeCurrent: timeWithMistakes,
				gradeLast: puzzleItem.grades[puzzleItem.grades.length - 1],
				timeLast: puzzleItem.timeTaken[puzzleItem.timeTaken.length - 1],
			}));

			if (hasSound) playGeneric();
			if (hasAutoMove) changePuzzle();
		},
		[
			puzzleItemList,
			puzzleIndex,
			changePuzzle,
			hasAutoMove,
			hasSound,
			playGeneric,
		],
	);

	/**
	 * Play the next comptuer move.
	 */
	const computerMove = useCallback(
		async (moveNumber: number) => {
			if (!chess || !moveHistory[moveNumber]) return;
			const move = chess.move(moveHistory[moveNumber]!);
			if (!move) return;
			await sleep(300);
			updateBoard(move.from, move.to, chess);
			setMoveNumber(previousMove => previousMove + 1);
			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();
		},
		[chess, moveHistory, hasSound, playCapture, playMove, updateBoard],
	);

	const checkIsMoveCorrect = useCallback(
		(move: Move, chess: Chess) =>
			`${move.from}${move.to}` === moveHistory[moveNumber] ||
			chess.isCheckmate(),
		[moveHistory, moveNumber],
	);

	const handleRightMove = useCallback(
		async (from: Square, to: Square, chess: Chess) => {
			updateBoard(from, to, chess);
			const currentMoveNumber = moveNumber + 1;
			setMoveNumber(previousMove => previousMove + 1);
			const isPuzzleComplete = currentMoveNumber === moveHistory.length;
			if (hasAnimation) {
				const animation = isPuzzleComplete ? 'finishMove' : 'rightMove';
				toggleAnimation(`animate-${animation}`).catch(console.error);
			}

			if (!isPuzzleComplete) {
				await computerMove(currentMoveNumber);
				return;
			}

			setIsComplete(() => true);
			setIsRunning(() => false);

			const {maxTime, minTime} = getTime.interval(moveHistory.length);
			const {timeTaken, timeWithMistakes} = getTime.taken(initialPuzzleTimer);
			const currentGrade = getGrade({
				didCheat: isSolutionClicked,
				mistakes,
				timeTaken,
				maxTime,
				minTime,
				streak: puzzleItemList[puzzleIndex]!.streak,
			});

			await updatePuzzleInDb(currentGrade, timeTaken, timeWithMistakes);

			if (set.current.spacedRepetition) {
				const isChunkComplete = completedPuzzles + 1 >= 20;
				if (isChunkComplete) await handleChunkComplete();
				return;
			}

			const isSetComplete = completedPuzzles + 1 === set.current.length;
			if (isSetComplete) {
				if (!initialSetDate) return;
				await updateSetInDb(initialSetDate);
				await handleSetComplete();
				return;
			}

			handlePuzzleComplete(currentGrade, timeWithMistakes);
		},
		[
			completedPuzzles,
			computerMove,
			handleChunkComplete,
			handlePuzzleComplete,
			handleSetComplete,
			hasAnimation,
			initialPuzzleTimer,
			initialSetDate,
			isSolutionClicked,
			mistakes,
			moveHistory.length,
			moveNumber,
			puzzleIndex,
			puzzleItemList,
			set.current?.length,
			set.current?.spacedRepetition,
			setIsComplete,
			toggleAnimation,
			updateBoard,
			updatePuzzleInDb,
			updateSetInDb,
		],
	);

	const handleWrongMove = useCallback(
		(chess: Chess) => {
			chess.undo();
			setMistakes(previous => previous + 1);
			setTotalMistakes(previous => previous + 1);
			if (hasAnimation)
				toggleAnimation('animate-wrongMove').catch(console.error);
			if (hasSound) playError();
		},
		[hasAnimation, hasSound, playError, toggleAnimation],
	);

	const checkIsPromotion = useCallback(
		(from: Square, to: Square, moves: Move[]): boolean => {
			for (const move of moves)
				if (move.from === from && move.to === to && move.flags.includes('p'))
					return true;

			return false;
		},
		[],
	);

	/**
	 * Function called on each move.
	 */
	const handleUserMove = useCallback(
		async (from: Square, to: Square) => {
			const moves = chess.moves({verbose: true});

			const isPromotion = checkIsPromotion(from, to, moves);
			if (isPromotion) {
				setPendingMove([from, to]);
				showPromotion();
				return;
			}

			const move = chess.move({from, to});
			if (move === null) return;

			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();

			const isRightMove = checkIsMoveCorrect(move, chess);
			if (isRightMove) {
				await handleRightMove(from, to, chess);
				return;
			}

			handleWrongMove(chess);
		},
		[
			checkIsPromotion,
			handleRightMove,
			handleWrongMove,
			checkIsMoveCorrect,
			chess,
			showPromotion,
			hasSound,
			playCapture,
			playMove,
		],
	);

	/**
	 * Handle promotions via chessground.
	 */
	const handlePromotion = useCallback(
		async (piece: Move['promotion']) => {
			const from = pendingMove[0]!;
			const to = pendingMove[1]!;
			const isRightMove =
				piece === moveHistory[moveNumber]!.slice(-1) || chess.isCheckmate();
			const move = chess.move({from, to, promotion: piece});
			if (move === null) return;

			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			if (hasSound) move.captured ? playCapture() : playMove();

			if (isRightMove) {
				await handleRightMove(from, to, chess);
				return;
			}

			handleWrongMove(chess);
		},
		[
			handleRightMove,
			handleWrongMove,
			pendingMove,
			moveHistory,
			moveNumber,
			chess,
			hasSound,
			playCapture,
			playMove,
		],
	);

	/**
	 * When the board is setup, make the first move.
	 */
	useEffectAsync(() => {
		if (!moveHistory || moveNumber !== 0) return;
		computerMove(0).catch(console.error);
	}, [moveHistory, moveNumber, computerMove]);

	const returnDashboard = async () => router.push('/dashboard');

	const launchTimer = useCallback(() => {
		setIsRunning(() => true);
	}, []);

	useKeyPress({targetKey: 'Q', fn: returnDashboard});
	useKeyPress({targetKey: 'q', fn: returnDashboard});
	useKeyPress({targetKey: 'Escape', fn: returnDashboard});
	useKeyPress({targetKey: 's', fn: changePuzzle});
	useKeyPress({targetKey: 'S', fn: changePuzzle});
	useKeyPress({targetKey: 'n', fn: changePuzzle});
	useKeyPress({targetKey: 'N', fn: changePuzzle});

	return (
		<>
			<NextSeo title='⚔️ Play' />
			<ModalSpacedEnd isOpen={isOpenSpacedOff} hide={hideSpacedOff} />
			<ModalSpacedOn
				isOpen={isOpenSpacedOn}
				hide={async () => {
					hideSpacedOn();
					await router.push('/dashboard');
				}}
				onClick={async () => {
					await activateSpacedRep(set);
					hideSpacedOn();
					router.reload();
				}}
			/>
			<div className='m-0 flex min-h-screen w-screen flex-col justify-start pt-12 pb-24 text-slate-800 md:pt-32'>
				<div className='flex flex-row justify-center gap-2'>
					{hasClock && (
						<Timer
							value={set.current?.currentTime}
							mistakes={totalMistakes}
							isRunning={isRunning}
						/>
					)}
					<Link href='/dashboard'>
						<Button className='my-2 w-36 items-center rounded-md bg-gray-800 leading-8'>
							LEAVE 🧨
						</Button>
					</Link>
				</div>
				<div className='flex w-full flex-col items-center justify-center md:flex-row'>
					<LeftBar stat={leftBarStat} />
					<div className='w-11/12 max-w-[33rem] flex-auto md:w-full'>
						<Board
							config={{
								...config,
								orientation,
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								events: {move: handleUserMove as any},
							}}
							isOpen={isOpenPromotion}
							hide={hidePromotion}
							color={getColor(chess.turn())}
							onPromote={handlePromotion}
						/>

						<BottomBar puzzles={previousPuzzle} />
					</div>
					<RightBar
						fen={chess.fen()}
						puzzle={puzzle}
						hasSpacedRepetition={set.current?.spacedRepetition}
						answer={moveHistory[moveNumber]!}
						changePuzzle={changePuzzle}
						launchTimer={launchTimer}
					/>
				</div>
			</div>
			<Notification
				text={notificationData.message}
				isVisible={showNotification}
				url={notificationData.url}
				setShow={setShowNotification}
			/>
		</>
	);
};

PlayingPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default PlayingPage;

export const getServerSideProps = withSessionSsr(
	async ({params, req}: GetServerSidePropsContext) => {
		const {userId} = req.session;
		if (!userId) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		const id = params?.id as string | undefined;
		if (!id) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		const puzzleSet = await prisma.puzzleSet
			.findUnique({
				where: {id},
			})
			.catch(console.error);

		const user = await prisma.user
			.findUnique({
				where: {id: userId},
				include: {
					puzzleSolvedByCategories: true,
				},
			})
			.catch(console.error);

		if (!puzzleSet || !user) {
			const redirect: Redirect = {statusCode: 303, destination: '/'};
			return {redirect};
		}

		return {props: {user, puzzleSet}};
	},
);
