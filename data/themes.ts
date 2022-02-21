import {Category} from './categories';

export type Theme = {
	title: string;
	id: string;
	description: string;
	category: Category;
};

const themes = [
	{
		title: 'Advanced pawn',
		id: 'advancedPawn',
		description:
			'One of your pawns is deep into the opponent position, maybe threatening to promote.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Advantage',
		id: 'advantage',
		description:
			'Seize your chance to get a decisive advantage. (200cp ≤ eval ≤ 600cp)',
		category: {name: 'Goals', id: '7'},
	},
	{
		title: "Anastasia's mate",
		id: 'anastasiaMate',
		description:
			'A knight and rook or queen team up to trap the opposing king between the side of the board and a friendly piece.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Arabian mate',
		id: 'arabianMate',
		description:
			'A knight and a rook team up to trap the opposing king on a corner of the board.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Attacking f2 or f7',
		id: 'attackingF2F7',
		description:
			'An attack focusing on the f2 or f7 pawn, such as in the fried liver opening.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Attraction',
		id: 'attraction',
		description:
			'An exchange or sacrifice encouraging or forcing an opponent piece to a square that allows a follow-up tactic.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Back rank mate',
		id: 'backRankMate',
		description:
			'Checkmate the king on the home rank, when it is trapped there by its own pieces.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Bishop endgame',
		id: 'bishopEndgame',
		description: 'An endgame with only bishops and pawns.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: "Boden's mate",
		id: 'bodenMate',
		description:
			'Two attacking bishops on criss-crossing diagonals deliver mate to a king obstructed by friendly pieces.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Castling',
		id: 'castling',
		description: 'Bring the king to safety, and deploy the rook for attack.',
		category: {name: 'Special moves', id: '6'},
	},
	{
		title: 'Capture the defender',
		id: 'capturingDefender',
		description:
			'Removing a piece that is critical to defence of another piece, allowing the now undefended piece to be captured on a following move.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Crushing',
		id: 'crushing',
		description:
			'Spot the opponent blunder to obtain a crushing advantage. (eval ≥ 600cp)',
		category: {name: 'Goals', id: '7'},
	},
	{
		title: 'Double bishop mate',
		id: 'doubleBishopMate',
		description:
			'Two attacking bishops on adjacent diagonals deliver mate to a king obstructed by friendly pieces.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Dovetail mate',
		id: 'dovetailMate',
		description:
			'A queen delivers mate to an adjacent king, whose only two escape squares are obstructed by friendly pieces.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Equality',
		id: 'equality',
		description:
			'Come back from a losing position, and secure a draw or a balanced position. (eval ≤ 200cp)',
		category: {name: 'Goals', id: '7'},
	},
	{
		title: 'Kingside attack',
		id: 'kingsideAttack',
		description:
			"An attack of the opponent's king, after they castled on the king side.",
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Clearance',
		id: 'clearance',
		description:
			'A move, often with tempo, that clears a square, file or diagonal for a follow-up tactical idea.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Defensive move',
		id: 'defensiveMove',
		description:
			'A precise move or sequence of moves that is needed to avoid losing material or another advantage.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Deflection',
		id: 'deflection',
		description:
			'A move that distracts an opponent piece from another duty that it performs, such as guarding a key square. Sometimes also called « overloading. »',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Discovered attack',
		id: 'discoveredAttack',
		description:
			'Moving a piece (such as a knight), that previously blocked an attack by a long range piece (such as a rook), out of the way of that piece.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Double check',
		id: 'doubleCheck',
		description:
			"Checking with two pieces at once, as a result of a discovered attack where both the moving piece and the unveiled piece attack the opponent's king.",
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Endgame',
		id: 'endgame',
		description: 'A tactic during the last phase of the game.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'En passant',
		id: 'enPassant',
		description:
			'A tactic involving the en passant rule, where a pawn can capture an opponent pawn that has bypassed it using its initial two-square move.',
		category: {name: 'Special moves', id: '6'},
	},
	{
		title: 'Exposed king',
		id: 'exposedKing',
		description:
			'A tactic involving a king with few defenders around it, often leading to checkmate.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Fork',
		id: 'fork',
		description:
			'A move where the moved piece attacks two opponent pieces at once.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Hanging piece',
		id: 'hangingPiece',
		description:
			'A tactic involving an opponent piece being undefended or insufficiently defended and free to capture.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Hook mate',
		id: 'hookMate',
		description:
			"Checkmate with a rook, knight, and pawn along with one enemy pawn to limit the enemy king's escape.",
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Interference',
		id: 'interference',
		description:
			'Moving a piece between two opponent pieces to leave one or both opponent pieces undefended, such as a knight on a defended square between two rooks.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Intermezzo',
		id: 'intermezzo',
		description:
			'Instead of playing the expected move, first interpose another move posing an immediate threat that the opponent must answer. Also known as « Zwischenzug » or « In between. »',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Knight endgame',
		id: 'knightEndgame',
		description: 'An endgame with only knights and pawns.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'Long puzzle',
		id: 'long',
		description: 'Three moves to win.',
		category: {name: 'Lengths', id: '8'},
	},
	{
		title: 'Master games',
		id: 'master',
		description: 'Puzzles from games played by titled players.',
		category: {name: 'Origin', id: '9'},
	},
	{
		title: 'Master vs Master games',
		id: 'masterVsMaster',
		description: 'Puzzles from games between two titled players.',
		category: {name: 'Origin', id: '9'},
	},
	{
		title: 'Checkmate',
		id: 'mate',
		description: 'Win the game with style.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Mate in 1',
		id: 'mateIn1',
		description: 'Deliver checkmate in one move.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Mate in 2',
		id: 'mateIn2',
		description: 'Deliver checkmate in two moves.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Mate in 3',
		id: 'mateIn3',
		description: 'Deliver checkmate in three moves.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Mate in 4',
		id: 'mateIn4',
		description: 'Deliver checkmate in four moves.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Mate in 5 or more',
		id: 'mateIn5',
		description: 'Figure out a long mating sequence.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Middlegame',
		id: 'middlegame',
		description: 'A tactic during the second phase of the game.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'One-move puzzle',
		id: 'oneMove',
		description: 'A puzzle that is only one move long.',
		category: {name: 'Lengths', id: '8'},
	},
	{
		title: 'Opening',
		id: 'opening',
		description: 'A tactic during the first phase of the game.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'Pawn endgame',
		id: 'pawnEndgame',
		description: 'An endgame with only pawns.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'Pin',
		id: 'pin',
		description:
			'A tactic involving pins, where a piece is unable to move without revealing an attack on a higher value piece.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Promotion',
		id: 'promotion',
		description: 'Promote one of your pawn to a queen or minor piece.',
		category: {name: 'Special moves', id: '6'},
	},
	{
		title: 'Queen endgame',
		id: 'queenEndgame',
		description: 'An endgame with only queens and pawns.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'Queen and Rook',
		id: 'queenRookEndgame',
		description: 'An endgame with only queens, rooks and pawns.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'Queenside attack',
		id: 'queensideAttack',
		description:
			"An attack of the opponent's king, after they castled on the queen side.",
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Quiet move',
		id: 'quietMove',
		description:
			'A move that does neither make a check or capture, nor an immediate threat to capture, but does prepare a more hidden unavoidable threat for a later move.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Rook endgame',
		id: 'rookEndgame',
		description: 'An endgame with only rooks and pawns.',
		category: {name: 'Phases', id: '2'},
	},
	{
		title: 'Sacrifice',
		id: 'sacrifice',
		description:
			'A tactic involving giving up material in the short-term, to gain an advantage again after a forced sequence of moves.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Short puzzle',
		id: 'short',
		description: 'Two moves to win.',
		category: {name: 'Lengths', id: '8'},
	},
	{
		title: 'Skewer',
		id: 'skewer',
		description:
			'A motif involving a high value piece being attacked, moving out the way, and allowing a lower value piece behind it to be captured or attacked, the inverse of a pin.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Smothered mate',
		id: 'smotheredMate',
		description:
			'A checkmate delivered by a knight in which the mated king is unable to move because it is surrounded (or smothered) by its own pieces.',
		category: {name: 'Mates', id: '5'},
	},
	{
		title: 'Super GM games',
		id: 'superGM',
		description: 'Puzzles from games played by the best players in the world.',
		category: {name: 'Origin', id: '9'},
	},
	{
		title: 'Trapped piece',
		id: 'trappedPiece',
		description: 'A piece is unable to escape capture as it has limited moves.',
		category: {name: 'Motifs', id: '3'},
	},
	{
		title: 'Underpromotion',
		id: 'underPromotion',
		description: 'Promotion to a knight, bishop, or rook.',
		category: {name: 'Special moves', id: '6'},
	},
	{
		title: 'Very long puzzle',
		id: 'veryLong',
		description: 'Four moves or more to win.',
		category: {name: 'Lengths', id: '8'},
	},
	{
		title: 'X-Ray attack',
		id: 'xRayAttack',
		description: 'A piece attacks or defends a square, through an enemy piece.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Zugzwang',
		id: 'zugzwang',
		description:
			'The opponent is limited in the moves they can make, and all moves worsen their position.',
		category: {name: 'Advanced', id: '4'},
	},
	{
		title: 'Healthy mix',
		id: 'healthyMix',
		description:
			"A bit of everything. You don't know what to expect, so you remain ready for anything! Just like in real games.",
		category: {name: 'Recommended', id: '1'},
	},
];

export default themes;
