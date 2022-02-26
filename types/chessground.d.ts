export declare type Color = typeof colors[number];
export declare type Role =
	| 'king'
	| 'queen'
	| 'rook'
	| 'bishop'
	| 'knight'
	| 'pawn';
export declare type File = typeof files[number];
export declare type Rank = typeof ranks[number];
export declare type Key = 'a0' | `${File}${Rank}`;
export declare type FEN = string;
export declare type Pos = [number, number];
export interface Piece {
	role: Role;
	color: Color;
	promoted?: boolean;
}
export interface Drop {
	role: Role;
	key: Key;
}
export declare type Pieces = Map<Key, Piece>;
export declare type PiecesDiff = Map<Key, Piece | undefined>;
export declare type KeyPair = [Key, Key];
export declare type NumberPair = [number, number];
export declare type NumberQuad = [number, number, number, number];
export interface Rect {
	left: number;
	top: number;
	width: number;
	height: number;
}
export declare type Dests = Map<Key, Key[]>;
export interface Elements {
	board: HTMLElement;
	container: HTMLElement;
	ghost?: HTMLElement;
	svg?: SVGElement;
	customSvg?: SVGElement;
}
export interface Dom {
	elements: Elements;
	bounds: Memo<ClientRect>;
	redraw: () => void;
	redrawNow: (skipSvg?: boolean) => void;
	unbind?: Unbind;
	destroyed?: boolean;
	relative?: boolean;
}
export interface Exploding {
	stage: number;
	keys: readonly Key[];
}
export interface MoveMetadata {
	premove: boolean;
	ctrlKey?: boolean;
	holdTime?: number;
	captured?: Piece;
	predrop?: boolean;
}
export interface SetPremoveMetadata {
	ctrlKey?: boolean;
}
export declare type MouchEvent = Event & Partial<MouseEvent & TouchEvent>;
export interface KeyedNode extends HTMLElement {
	cgKey: Key;
}
export interface PieceNode extends KeyedNode {
	tagName: 'PIECE';
	cgPiece: string;
	cgAnimating?: boolean;
	cgFading?: boolean;
	cgDragging?: boolean;
}
export interface SquareNode extends KeyedNode {
	tagName: 'SQUARE';
}
export interface Memo<A> {
	(): A;
	clear: () => void;
}
export interface Timer {
	start: () => void;
	cancel: () => void;
	stop: () => number;
}
export declare type Redraw = () => void;
export declare type Unbind = () => void;
export declare type Milliseconds = number;
export declare type KHz = number;
export declare const colors: readonly ['white', 'black'];
export declare const files: readonly ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export declare const ranks: readonly ['1', '2', '3', '4', '5', '6', '7', '8'];
