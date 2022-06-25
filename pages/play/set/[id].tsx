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
import Layout from '@/layouts/main';
import {sleep, sortBy} from '@/lib/utils';
import {
	configµ,
	orientationµ,
	animationµ,
	playµ,
	revertedµ,
	Animation,
} from '@/lib/atoms';
import useModal from '@/hooks/use-modal';
import useKeyPress from '@/hooks/use-key-press';
import {Button} from '@/components/button';
import {checkForAchievement, getCheckAchivementBody} from '@/lib/achievements';
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
	get as get_,
	update as update_,
	getGrade,
	getMovable,
	getTimeInterval,
	getTimeTaken,
	getUpdateBody,
	getColor,
	retrieveCurrentPuzzle_,
	updatePuzzleSolvedByCategories,
	getPuzzleSetUpdate,
} from '@/lib/play';
import LeftBar, {Stat} from '@/components/play/left-bar';
import Board from '@/components/play/board';
import RightBar from '@/components/play/right-bar';
import Timer from '@/components/play/timer';
import BottomBar from '@/components/play/bottom-bar';
import useEffectAsync from '@/hooks/use-effect-async';

const Notification = dynamic(async () => import('@/components/notification'));
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
	const [moveNumber, setMoveNumber] = useState(0);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [previousPuzzle, setPreviousPuzzle] = useState<PreviousPuzzle[]>([]);
	const [totalMistakes, setTotalMistakes] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [initialSetDate, setInitialSetDate] = useState<number>();
	const [isRunning, setIsRunning] = useState(false);
	const [pendingMove, setPendingMove] = useState<Square[]>([]);
	const [leftBarStat, setLeftBarStat] = useState<Stat>();
	const [streakData, setStreakData] = useState({mistakes: 0, time: 0});

	const [showNotification, setShowNotification] = useState(false);
	const [notificationData, setNotificationData] = useState({
		message: '',
		url: '',
	});
	const [totalPuzzleSolved, setTotalPuzzleSolved] = useState(
		user.totalPuzzleSolved,
	);
	const [puzzleSolvedByCategories, setPuzzleSolvedByCategories] = useState(
		user.puzzleSolvedByCategories,
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
		setCompletedPuzzles(() => set.progress);
		setTotalPuzzles(() => set.length);
		setInitialSetDate(() => Date.now());
		setPuzzleItemList(() =>
			sortBy(
				set.puzzles.filter(p => !p.played),
				'order',
			),
		);
	}, []);

	const retrieveCurrentPuzzle = useCallback(retrieveCurrentPuzzle_, [
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
		const chess = new Chess(puzzle.FEN);
		setChess(() => chess);
		setMoveHistory(() => puzzle.Moves.split(' '));
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

	const updateBoard = useCallback(
		(from: Square, to: Square, chess: ChessJS.ChessInstance) => {
			setConfig(config => ({
				...config,
				fen: chess.fen(),
				check: chess.in_check(),
				movable: getMovable(chess),
				turnColor: getColor(chess.turn()),
				lastMove: [from, to],
			}));
		},
		[],
	);

	/**
	 * Push the data of the current puzzle when complete.
	 */
	const updatePuzzleInDb = useCallback(
		async (
			currentGrade: number,
			timeTaken: number,
			timeWithMistakes: number,
		) => {
			if (!puzzle || !user) return;
			const streakMistakes_ = mistakes === 0 ? streakData.mistakes + 1 : 0;
			const streakTime_ = timeTaken < 5 ? streakData.time + 1 : 0;
			setStreakData(() => ({mistakes: streakMistakes_, time: streakTime_}));

			const updatePuzzleSet = getPuzzleSetUpdate({
				currentTime: timeWithMistakes,
				mistakes,
				timeTaken,
				currentGrade,
			});

			updatePuzzleSet.$inc['puzzles.$.streak'] = currentGrade >= 5 ? 1 : 0;

			const puzzleSolvedByCategories_ = updatePuzzleSolvedByCategories(
				puzzleSolvedByCategories,
				puzzle.Themes,
			);

			const updateUser = {
				$inc: {totalPuzzleSolved: 1, totalTimePlayed: timeTaken},
				$set: {puzzleSolvedByCategories: puzzleSolvedByCategories_},
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
				handleCheckAchievements({streakMistakes_, streakTime_}),
			]).catch(console.error);
		},
		[
			handleCheckAchievements,
			mistakes,
			puzzle,
			puzzleIndex,
			puzzleItemList,
			puzzleSolvedByCategories,
			set._id,
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
			const {timeTaken} = getTimeTaken(initialSetDate);
			const totalTimeTaken = timeTaken + set.currentTime;
			const update = getUpdateBody.finishedSet(totalTimeTaken);
			await update_.set(set._id.toString(), update).catch(console.error);
		},
		[set._id, set.currentTime],
	);

	const handleSetComplete = useCallback(async () => {
		if (hasSound) playVictory();
		showSpacedOn();
	}, [hasSound, playVictory, showSpacedOn]);

	const handleChunkComplete = useCallback(async () => {
		await updateSpacedRepetition(set, showSpacedOff);
		router.reload();
	}, [set, showSpacedOff]);

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
	}, [isComplete]);

	useEffect(() => {
		if (isComplete && hasAutoMove) changePuzzle();
	}, [isComplete, hasAutoMove, changePuzzle]);

	const handlePuzzleComplete = useCallback(
		(currentGrade: number, timeWithMistakes: number) => {
			const puzzleItem = puzzleItemList[puzzleIndex];
			setPreviousPuzzle(previous => [
				...previous,
				{
					grade: currentGrade,
					PuzzleId: puzzleItem.PuzzleId,
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
			if (!chess) return;
			const move = chess.move(moveHistory[moveNumber], {sloppy: true});
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
		(move: ChessJS.Move, chess: ChessJS.ChessInstance) =>
			`${move.from}${move.to}` === moveHistory[moveNumber] ||
			chess.in_checkmate(),
		[moveHistory, moveNumber],
	);

	const handleRightMove = useCallback(
		async (from: Square, to: Square, chess: ChessJS.ChessInstance) => {
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

			const {maxTime, minTime} = getTimeInterval(moveHistory.length);
			const {timeTaken, timeWithMistakes} = getTimeTaken(initialPuzzleTimer);
			const currentGrade = getGrade({
				didCheat: isSolutionClicked,
				mistakes,
				timeTaken,
				maxTime,
				minTime,
				streak: puzzleItemList[puzzleIndex].streak,
			});

			await updatePuzzleInDb(currentGrade, timeTaken, timeWithMistakes);

			if (set.spacedRepetition) {
				const isChunkComplete = completedPuzzles + 1 >= 20;
				if (isChunkComplete) await handleChunkComplete();
				return;
			}

			const isSetComplete = completedPuzzles + 1 === set.length;
			console.log('set.progress', set.progress)
			console.log('completedPuzzles', completedPuzzles + 1);
			console.log('isSetComplete', isSetComplete);
			if (isSetComplete) {
				if (!initialSetDate) return;
				setIsRunning(() => false);
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
			set.length,
			puzzleItemList,
			set.spacedRepetition,
			setIsComplete,
			toggleAnimation,
			updateBoard,
			updatePuzzleInDb,
			updateSetInDb,
		],
	);

	const handleWrongMove = useCallback(
		(chess: ChessJS.ChessInstance) => {
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
		(from: Square, to: Square, moves: ChessJS.Move[]): boolean => {
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
		],
	);

	/**
	 * Handle promotions via chessground.
	 */
	const handlePromotion = useCallback(
		async (piece: ShortMove['promotion']) => {
			const from = pendingMove[0];
			const to = pendingMove[1];
			const isRightMove =
				piece === moveHistory[moveNumber].slice(-1) || chess.in_checkmate();
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
						hasSpacedRepetition={set.spacedRepetition}
						answer={moveHistory[moveNumber]}
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
