import * as cg from './chessground';

export interface Config {
	fen?: cg.FEN;
	orientation?: cg.Color;
	turnColor?: cg.Color;
	check?: cg.Color | boolean;
	lastMove?: cg.Key[];
	selected?: cg.Key;
	coordinates?: boolean;
	autoCastle?: boolean;
	viewOnly?: boolean;
	disableContextMenu?: boolean;
	resizable?: boolean;
	addPieceZIndex?: boolean;
	highlight?: {
		lastMove?: boolean;
		check?: boolean;
	};
	animation?: {
		enabled?: boolean;
		duration?: number;
	};
	movable?: {
		free?: boolean;
		color?: cg.Color | 'both';
		dests?: cg.Dests;
		showDests?: boolean;
		events?: {
			after?: (orig: cg.Key, dest: cg.Key, metadata: cg.MoveMetadata) => void;
			afterNewPiece?: (
				role: cg.Role,
				key: cg.Key,
				metadata: cg.MoveMetadata,
			) => void;
		};
		rookCastle?: boolean;
	};
	premovable?: {
		enabled?: boolean;
		showDests?: boolean;
		castle?: boolean;
		dests?: cg.Key[];
		events?: {
			set?: (
				orig: cg.Key,
				dest: cg.Key,
				metadata?: cg.SetPremoveMetadata,
			) => void;
			unset?: () => void;
		};
	};
	predroppable?: {
		enabled?: boolean;
		events?: {
			set?: (role: cg.Role, key: cg.Key) => void;
			unset?: () => void;
		};
	};
	draggable?: {
		enabled?: boolean;
		distance?: number;
		autoDistance?: boolean;
		showGhost?: boolean;
		deleteOnDropOff?: boolean;
	};
	selectable?: {
		enabled?: boolean;
	};
	events?: {
		change?: () => void;
		move?: (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => void;
		dropNewPiece?: (piece: cg.Piece, key: cg.Key) => void;
		select?: (key: cg.Key) => void;
		insert?: (elements: cg.Elements) => void;
	};
	drawable?: {
		enabled?: boolean;
		visible?: boolean;
		defaultSnapToValidMove?: boolean;
		eraseOnClick?: boolean;
		shapes?: DrawShape[];
		autoShapes?: DrawShape[];
		brushes?: DrawBrush[];
		pieces?: {
			baseUrl?: string;
		};
		onChange?: (shapes: DrawShape[]) => void;
	};
}
