/* eslint-disable @typescript-eslint/no-unsafe-return */
import type {Data as PuzzleData, UpdateData} from '@/api/puzzle/[id]';
import type {Data as SetData} from '@/api/set/[id]';
import type {Data as UserData} from '@/api/user/[id]';
import {ThemeItem} from '@/types/models';

const getPuzzleById = async (id: string): Promise<PuzzleData> =>
	fetch(`/api/puzzle/${id}`).then(async response => response.json());

type PuzzleUpdate = {
	$inc: {
		'puzzles.$.count': number;
		currentTime: number;
		progression: number;
		'puzzles.$.streak'?: number;
	};
	$push: {
		'puzzles.$.mistakes': number;
		'puzzles.$.timeTaken': number;
		'puzzles.$.grades': number;
	};
	$set: {
		'puzzles.$.played': boolean;
		'puzzles.$.streak'?: number;
	};
};

const updatePuzzle = async (
	setId: string,
	puzzleId: string,
	data: PuzzleUpdate,
): Promise<UpdateData> =>
	fetch(`/api/puzzle/${puzzleId}`, {
		method: 'PUT',
		body: JSON.stringify({_id: setId, update: data}),
	}).then(async response => response.json());

const getSetById = async (baseUrl: string, id: string): Promise<SetData> =>
	fetch(`${baseUrl}/api/set/${id}`).then(async response => response.json());

type SetUpdate = {
	$inc: {
		cycles: number;
	};
	$push: {
		times: number;
	};
	$set: {
		'puzzles.$[].played': boolean;
		currentTime: number;
		progression: number;
	};
};

const updateSet = async (id: string, data: SetUpdate): Promise<SetData> =>
	fetch(`/api/set/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export type UpdateUser =
	| {
			$inc: {
				totalPuzzleSolved: number;
				puzzleSolvedByCategories?: Record<number, ThemeItem>;
			};
	  }
	| {
			$push: {
				puzzleSolvedByCategories: {
					$each: ThemeItem[];
				};
			};
	  };

const updateUser = async (id: string, data: UpdateUser): Promise<UserData> =>
	fetch(`/api/user/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export const get = {
	puzzle: getPuzzleById,
	set: getSetById,
};

export const update = {
	puzzle: updatePuzzle,
	set: updateSet,
	user: updateUser,
};
