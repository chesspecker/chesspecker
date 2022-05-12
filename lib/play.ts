/* eslint-disable @typescript-eslint/no-unsafe-return */
import {UpdateQuery} from 'mongoose';
import type {Data as PuzzleData, UpdateData} from '@/api/puzzle/[id]';
import type {Data as SetData} from '@/api/set/[id]';
import type {Data as UserData} from '@/api/user/[id]';
import {
	PuzzleItemInterface,
	PuzzleSetInterface,
	ThemeItem,
	UserInterface,
} from '@/types/models';

const getPuzzleById = async (id: string, baseUrl = ''): Promise<PuzzleData> =>
	fetch(`${baseUrl}/api/puzzle/${id}`).then(async response => response.json());

const updatePuzzle = async (
	setId: string,
	puzzleId: string,
	data: UpdateQuery<Partial<PuzzleItemInterface>>,
): Promise<UpdateData> =>
	fetch(`/api/puzzle/${puzzleId}`, {
		method: 'PUT',
		body: JSON.stringify({_id: setId, update: data}),
	}).then(async response => response.json());

const getSetById = async (id: string, baseUrl = ''): Promise<SetData> =>
	fetch(`${baseUrl}/api/set/${id}`).then(async response => response.json());

const updateSet = async (
	id: string,
	data: UpdateQuery<Partial<PuzzleSetInterface>>,
): Promise<SetData> =>
	fetch(`/api/set/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export type UpdateUser = {
	$inc: {
		totalPuzzleSolved: number;
		totalTimePlayed: number;
		puzzleSolvedByCategories?: Record<number, ThemeItem>;
	};
	$push?: {
		puzzleSolvedByCategories: {
			$each: ThemeItem[];
		};
	};
};

const updateUser = async (
	id: string,
	data: UpdateQuery<Partial<UserInterface>>,
): Promise<UserData> =>
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
