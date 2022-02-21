import Chessground from '@react-chess/chessground';
import {Chess} from 'chess.js';
import type {Square} from 'chess.js';

import useSound from 'use-sound';
import {useState, useEffect, useCallback} from 'react';
import Router from 'next/router.js';
import {fetcher} from '@/lib/fetcher';

import SOUND_MOVE from '@/sounds/Move.mp3';
import SOUND_CAPTURE from '@/sounds/Capture.mp3';
import SOUND_ERROR from '@/sounds/Error.mp3';
import SOUND_GENERIC from '@/sounds/GenericNotify.mp3';
import SOUND_VICTORY from '@/sounds/Victory.mp3';
import {PuzzleSetInterface} from '@/models/puzzle-set-model';
import {PuzzleInterface} from '@/models/puzzle-model';

type Props = {currentSetProps: PuzzleSetInterface};

declare const files: readonly ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
declare const ranks: readonly ['1', '2', '3', '4', '5', '6', '7', '8'];
declare type File = typeof files[number];
declare type Rank = typeof ranks[number];
declare type Key = 'a0' | `${File}${Rank}`;
declare type Dests = Map<Key, Key[]>;

const BOARD_LIST = [
	'blue.svg',
	'brown.svg',
	'gray.jpg',
	'green.svg',
	'leather.jpg',
	'marble.jpg',
	'purple.svg',
	'wood1.jpg',
	'wood2.jpg',
	'wood3.jpg',
];

const sortBy = (array: any[], p) =>
	[...array].sort((a, b) => (a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0));

const get_ = (value: string) => JSON.parse(localStorage.getItem(value) || '{}');
const set_ = (value: [string, any]) => {
	localStorage.setItem(value[0], JSON.stringify(value[1]));
};

const PlayingPage = ({currentSetProps}: Props) => {
	console.log('currentSetProps', currentSetProps);

	const [moveSound] = useSound(SOUND_MOVE);
	const [captureSound] = useSound(SOUND_CAPTURE);
	const [errorSound] = useSound(SOUND_ERROR);
	const [genericSound] = useSound(SOUND_GENERIC);
	const [victorySound] = useSound(SOUND_VICTORY);

	const [isSoundDisabled, setIsSoundDisabled] = useState(false);

	const [fen, setFen] = useState('');
	const [turn, setTurn] = useState('w');
	const [malus, setMalus] = useState(0);
	const [chess, setChess] = useState(new Chess());
	const [counter, setCounter] = useState(0);

	const [history, setHistory] = useState([]);

	const [lastMove, setLastMove] = useState<Square[]>();
	const [moveNumber, setMoveNumber] = useState(0);
	const [gameLink, setGameLink] = useState('');
	const [mistakesNumber, setMistakesNumber] = useState(0);

	const [puzzleList, setPuzzleList] = useState([]);
	const [puzzleListLength, setPuzzleListLength] = useState(0);

	const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleInterface>();
	const [actualPuzzle, setActualPuzzle] = useState(0);
	const [puzzleCompleteInSession, setPuzzleCompleteInSession] = useState(0);

	const [pendingMove, setPendingMove] = useState<Square[]>();
	const [orientation, setOrientation] = useState<'white' | 'black'>();

	const [timerRunning, setTimerRunning] = useState(false);
	const [timerBeforeCurrentPuzzle, setTimerBeforeCurrentPuzzle] = useState(0);

	const [isComplete, setIsComplete] = useState(false);
	const [autoMove, setAutoMove] = useState(true);

	const [sucessVisible, setSucessVisible] = useState(false);
	const [selectVisible, setSelectVisible] = useState(false);
	const [solutionVisible, setSolutionVisible] = useState(false);
	const [startPopupVisible, setStartPopupVisible] = useState(true);

	const [wrongMoveVisible, setWrongMoveVisible] = useState(false);
	const [rightMoveVisible, setRightMoveVisible] = useState(false);

	const [finishMoveVisible, setFinishMoveVisible] = useState(false);

	const [boardColor, setBoardColor] = useState(0);

	const [text, setText] = useState({
		title: 'Your turn',
		subtitle: `Find the best move.`,
	});

	/**
	 * Setup timer.
	 */
	useEffect(() => {
		if (timerRunning)
			setTimeout(() => {
				setCounter(lastCount => lastCount + 1);
			}, 1000);
	}, [timerRunning, counter]);

	/**
	 * Get last value setIsSoundDisabled
	 */
	useEffect(() => {
		let soundDisabled = get_('isSoundDisabled');
		if (soundDisabled === 'true') soundDisabled = true;
		if (soundDisabled === 'false') soundDisabled = false;
		setIsSoundDisabled(soundDisabled);
	}, []);

	/**
	 * Save setIsSoundDisabled to local storage
	 */
	useEffect(() => {
		set_(['isSoundDisabled', isSoundDisabled]);
	}, [isSoundDisabled]);

	/**
	 * Get last value autoMove
	 */
	useEffect(() => {
		let newAutoMove = get_('autoMove');
		if (newAutoMove === 'true') newAutoMove = true;
		if (newAutoMove === 'false') newAutoMove = false;
		setAutoMove(newAutoMove);
	}, []);

	/**
	 * Save autoMove to local storage
	 */
	useEffect(() => {
		set_(['autoMove', autoMove]);
	}, [autoMove]);

	/**
	 * Retrieve the set.
	 * Extract the list of puzzles.
	 */
	useEffect(() => {
		setCounter(currentSetProps.currentTime);
		setTimerBeforeCurrentPuzzle(currentSetProps.currentTime);
		const puzzleList = currentSetProps.puzzles.filter(p => !p.played);
		const sortedPuzzleList = sortBy(puzzleList, 'order');
		setPuzzleList(() => sortedPuzzleList);
	}, [currentSetProps.currentTime, currentSetProps.puzzles]);

	/**
	 * Set the number of puzzles remaining.
	 */
	useEffect(() => {
		if (puzzleList.length === 0) return;
		setPuzzleListLength(() => puzzleList.length);
	}, [puzzleList]);

	/**
	 * Wait to show solution button.
	 */
	useEffect(() => {
		const timeTaken = counter - timerBeforeCurrentPuzzle;
		if (timeTaken < 6) setSolutionVisible(() => false);
		if (timeTaken > 6) setSolutionVisible(() => true);
	}, [counter, timerBeforeCurrentPuzzle]);

	/**
	 * RightBar title.
	 */
	useEffect(() => {
		const title = 'Your turn';
		const subtitle = `Find the best move for ${orientation}.`;
		const text = {title, subtitle};
		setText(() => text);
	}, [orientation, actualPuzzle]);

	/**
	 * Retrieve current puzzle.
	 */
	useEffect(() => {
		if (!puzzleList[actualPuzzle] || puzzleList.length === 0) return;
		const puzzleToGet = puzzleList[actualPuzzle];
		const getCurrentPuzzle = async () => {
			try {
				const data = await fetcher.get(`/api/puzzle/${puzzleToGet._id}`);
				setGameLink(() => `https://lichess.org/training/${data.PuzzleId}`);
				setCurrentPuzzle(() => data as PuzzleInterface);
			} catch (error) {
				console.log(error);
			}
		};

		getCurrentPuzzle();
	}, [puzzleList, actualPuzzle]);

	/**
	 * Setup the board.
	 */
	useEffect(() => {
		if (!currentPuzzle.Moves) return;
		const chessJs = new Chess(currentPuzzle.FEN);
		const history = currentPuzzle.Moves.split(' ');

		setIsComplete(() => false);
		setPendingMove(() => undefined);
		setLastMove(() => undefined);
		setMoveNumber(() => 0);
		setHistory(() => history);
		setChess(() => chessJs);
		setFen(() => chessJs.fen());
		setTurn(() => chessJs.turn());
		setOrientation(() => (chessJs.turn() === 'b' ? 'white' : 'black'));
	}, [currentPuzzle]);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedPuzzle = useCallback(async () => {
		const actualPuzzleId = puzzleList[actualPuzzle];
		const timeTaken = counter - timerBeforeCurrentPuzzle;
		const mistakes = mistakesNumber;
		try {
			await fetcher.put(`/api/puzzle/${currentSetProps._id}`, {
				puzzleId: actualPuzzleId._id,
				options: {mistakes, timeTaken},
			});
		} catch (error) {
			console.log(error);
		}
	}, [
		actualPuzzle,
		counter,
		mistakesNumber,
		puzzleList,
		timerBeforeCurrentPuzzle,
		currentSetProps._id,
	]);

	/**
	 * Called when puzzle is completed, switch to the next one.
	 */
	const changePuzzle = useCallback(async () => {
		await updateFinishedPuzzle();
		setPuzzleCompleteInSession(previous => previous + 1);
		setMistakesNumber(() => 0);
		setSolutionVisible(() => false);
		setTimerBeforeCurrentPuzzle(() => counter);
		setActualPuzzle(previousPuzzle => previousPuzzle + 1);
	}, [counter, updateFinishedPuzzle]);

	/**
	 * Push the data of the current set when complete.
	 */
	const updateFinishedSet = useCallback(async () => {
		try {
			await fetcher.put(`/api/set/complete/${currentSetProps._id}`, {
				cycles: true,
				bestTime: counter + 1,
			});
		} catch (error) {
			console.log(error);
		}
	}, [counter, currentSetProps]);

	/**
	 * Called after each correct move.
	 */
	const checkSetComplete = useCallback(async () => {
		if (actualPuzzle + 1 === puzzleListLength) {
			setTimerRunning(() => false);
			setSucessVisible(() => true);
			if (!isSoundDisabled) victorySound();
			/**
			 * Not working properly yet
			 * 
			setFinishMoveVisible(() => true);
			setTimeout(() => setFinishMoveVisible(() => false), 600);
			 */
			await updateFinishedSet();
			return true;
		}

		return false;
	}, [
		actualPuzzle,
		isSoundDisabled,
		puzzleListLength,
		updateFinishedSet,
		victorySound,
	]);

	/**
	 * Called after each correct move.
	 */
	const checkPuzzleComplete = useCallback(
		async moveNumber => {
			if (moveNumber === history.length) {
				const isSetComplete = await checkSetComplete();
				if (isSetComplete) return true;
				if (!isSoundDisabled) genericSound();
				/**
			 * Not working properly yet
			 * 
			setFinishMoveVisible(() => true);
			setTimeout(() => setFinishMoveVisible(() => false), 600);
			 */
				setIsComplete(() => true);
				if (autoMove) changePuzzle();
				return true;
			}

			return false;
		},
		[
			autoMove,
			changePuzzle,
			checkSetComplete,
			genericSound,
			history.length,
			isSoundDisabled,
		],
	);

	/**
	 * Function making the computer play the next move.
	 */
	const computerMove = useCallback(
		(index: number) => {
			const move = chess.move(history[index], {sloppy: true});
			if (move && move.from) setLastMove(() => [move.from, move.to]);
			setFen(chess.fen());
			checkPuzzleComplete(moveNumber + 1);
			setMoveNumber(previousMove => previousMove + 1);
			if (!isSoundDisabled) moveSound();
		},
		[
			checkPuzzleComplete,
			chess,
			history,
			isSoundDisabled,
			moveNumber,
			moveSound,
		],
	);

	/**
	 * When the board is setup, make the first move.
	 */
	useEffect(() => {
		if (!history) return;
		if (moveNumber === 0)
			setTimeout(() => {
				computerMove(moveNumber);
			}, 500);
	}, [history, moveNumber, computerMove]);

	/**
	 * Allow only legal moves.
	 */
	const calcMovable = (): {
		free: boolean;
		dests: Dests;
		color: 'white' | 'black' | 'both';
		draggable: {
			showGhost: boolean;
		};
	} => {
		const dests = new Map();
		for (const s of chess.SQUARES) {
			const ms = chess.moves({square: s, verbose: true});
			if (ms.length > 0)
				dests.set(
					s,
					ms.map(m => m.to),
				);
		}

		return {
			free: false,
			dests,
			color: turn === 'b' ? 'white' : 'black',
			draggable: {
				showGhost: true,
			},
		};
	};

	const onRightMove = async (from, to) => {
		setFen(() => chess.fen());
		setMoveNumber(previousMove => previousMove + 1);
		setLastMove(() => [from, to]);
		const isPuzzleComplete = await checkPuzzleComplete(moveNumber);
		if (isPuzzleComplete) return;
		setRightMoveVisible(() => true);
		setTimeout(() => {
			setRightMoveVisible(() => false);
		}, 600);
		setTimeout(() => {
			computerMove(moveNumber + 1);
		}, 800);
	};

	const onWrongMove = () => {
		chess.undo();
		setFen(() => chess.fen());
		setMalus(lastCount => lastCount + 3);
		setMistakesNumber(previous => previous + 1);
		if (!isSoundDisabled) errorSound();
		setWrongMoveVisible(() => true);
		setTimeout(() => {
			setWrongMoveVisible(() => false);
		}, 600);
		setText(() => ({
			title: `That's not the move!`,
			subtitle: `Try something else.`,
		}));
	};

	/**
	 * Function called when the user plays.
	 */
	const onMove = async (from: Square, to: Square) => {
		const moves = chess.moves({verbose: true});
		for (let i = 0, length_ = moves.length; i < length_; i++) {
			if (moves[i].flags.includes('p') && moves[i].from === from) {
				setPendingMove(() => [from, to]);
				setSelectVisible(true);
				return;
			}
		}

		const move = chess.move({from, to});
		if (move === null) return;
		if (move.captured && !isSoundDisabled) {
			captureSound();
		} else if (!isSoundDisabled) {
			moveSound();
		}

		const isCorrectMove = validateMove(move);
		if (isCorrectMove || chess.in_checkmate()) {
			await onRightMove(from, to);
		} else {
			onWrongMove();
		}
	};

	/**
	 * Check if the move is valid.
	 */
	const validateMove = ({from, to}: {from: Square; to: Square}) =>
		`${from}${to}` === history[moveNumber];

	/**
	 * Handle promotions via chessground.
	 */
	const promotion = async piece => {
		setSelectVisible(false);
		const from = pendingMove[0];
		const to = pendingMove[1];
		const isCorrectMove = piece === history[moveNumber].slice(-1);
		chess.move({from, to, promotion: piece});

		if (isCorrectMove || chess.in_checkmate()) {
			onRightMove(from, to);
			return;
		}

		onWrongMove();
	};

	/**
	 * Return the correct turn color as a string.
	 */
	const turnColor = (string_: string): 'white' | 'black' =>
		string_ === 'w' ? 'white' : 'black';

	/**
	 * Switch board orientation
	 */
	const switchOrientation = () => {
		setOrientation(orientation =>
			orientation === 'white' ? 'black' : 'white',
		);
	};

	/**
	 * Toggle autoMove
	 */
	const toggleAutoMove = () => {
		setAutoMove(previous => !previous);
	};

	const toggleSound = () => {
		setIsSoundDisabled(previous => !previous);
	};

	const moveToNext = async () => changePuzzle();

	const handleKeyPress = useCallback(
		event => {
			switch (event.key) {
				case 'Q':
				case 'q':
				case 'Escape':
					Router.push('/dashboard');
					break;
				case 's':
				case 'S':
				case 'n':
				case 'N':
					if (!isComplete) break;
					changePuzzle();
					break;
				default:
					break;
			}
		},
		[changePuzzle, isComplete],
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	const handleRestart = () => {
		setPuzzleCompleteInSession(() => 0);
		setActualPuzzle(() => 0);
		setCounter(() => 0);
		setMalus(() => 0);
		setTimerRunning(() => true);
		setSucessVisible(() => false);
	};

	const handleStart = () => {
		setMalus(() => 0);
		setStartPopupVisible(() => false);
		setTimerRunning(true);
	};

	const handleLeaveGame = () => {
		Router.push('/dashboard');
	};

	const getPercentage = () =>
		(1 -
			(puzzleList.length - puzzleCompleteInSession) / currentSetProps.length) *
		100;

	const getChessgroundConfig = () => ({
		fen,
		orientation,
		turnColor: turnColor(chess.turn()),
		check: chess.in_check(),
		lastMove,
		movable: calcMovable(),
		background: BOARD_LIST[boardColor],
		wrongMoveVisible,
		rightMoveVisible,
		finishMoveVisible,
		onMove,
	});

	return (
		<div>
			<Chessground config={getChessgroundConfig()} />
		</div>
	);
};

export default PlayingPage;

export const getServerSideProps = async ({params}) => {
	const {id} = params;
	const data = await fetcher.get(`/api/set/${id}`);
	if (!data) return {notFound: true};
	return {props: {currentSetProps: data}};
};
