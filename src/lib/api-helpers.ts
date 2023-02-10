/* eslint-disable @typescript-eslint/no-unsafe-return */
import type {UpdateQuery} from 'mongoose';
import type {PuzzleItem} from '@/models/puzzle-item';
import type {PuzzleSet} from '@/models/puzzle-set';
import type {User} from '@/models/user';
import type {PuzzleData, PuzzleSetData} from '@/pages/api/puzzle/[id]';
import type {SetData} from '@/pages/api/set/[id]';
import type {UserData} from '@/pages/api/user/[id]';
import type {ThemeItem} from '@/models/theme';
import type {PuzzleSetArrayData} from '@/pages/api/setBy/[user]';
import type {SessionData} from '@/pages/api/checkout-sessions/[id]';
import type {SubscriptionData} from '@/pages/api/subscription/[id]';

const getPuzzleById = async (id: string, baseUrl = ''): Promise<PuzzleData> =>
	fetch(`${baseUrl}/api/puzzle/${id}`).then(async response => response.json());

const getSetById = async (id: string, baseUrl = ''): Promise<SetData> =>
	fetch(`${baseUrl}/api/set/${id}`).then(async response => response.json());

const getUserById = async (id: string, baseUrl = ''): Promise<UserData> =>
	fetch(`${baseUrl}/api/user/${id}`).then(async response => response.json());

export const getUser = async (baseUrl = ''): Promise<UserData> =>
	fetch(`${baseUrl}/api/user`).then(async response => response.json());

const getSession = async (id: string): Promise<SessionData> =>
	fetch(`/api/checkout-sessions/${id}`).then(async response => response.json());

const getSubscription = async (id: string): Promise<SubscriptionData> =>
	fetch(`/api/subscription/${id}`).then(async response => response.json());

const getSetByUser = async (
	user: string,
	baseUrl = '',
): Promise<PuzzleSetArrayData> =>
	fetch(`${baseUrl}/api/setBy/${user}`).then(async response => response.json());

const getPuzzleRandomly = async (): Promise<PuzzleData> =>
	fetch('/api/puzzle/random').then(async response => response.json());

const updatePuzzle = async (
	setId: string,
	puzzleId: string,
	data: UpdateQuery<Partial<PuzzleItem>>,
): Promise<PuzzleSetData> =>
	fetch(`/api/puzzle/${puzzleId}`, {
		method: 'PUT',
		body: JSON.stringify({_id: setId, update: data}),
	}).then(async response => response.json());

const updateSet = async (
	id: string,
	data: UpdateQuery<Partial<PuzzleSet>>,
): Promise<SetData> =>
	fetch(`/api/set/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export type UpdateUser =
	| {
			$inc: {
				totalPuzzleSolved: number;
				totalTimePlayed: number;
				puzzleSolvedByCategories?: {[key: number]: ThemeItem};
			};
	  }
	| {
			$push: {
				puzzleSolvedByCategories: {
					$each: ThemeItem[];
				};
			};
	  };

const updateUser = async (
	id: string,
	data: UpdateQuery<Partial<User>>,
): Promise<UserData> =>
	fetch(`/api/user/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	}).then(async response => response.json());

export const get_ = {
	puzzle: getPuzzleById,
	randomePuzzle: getPuzzleRandomly,
	set: getSetById,
	setByUser: getSetByUser,
	user: getUserById,
	session: getSession,
	subscription: getSubscription,
};

export const update_ = {
	puzzle: updatePuzzle,
	set: updateSet,
	user: updateUser,
};
