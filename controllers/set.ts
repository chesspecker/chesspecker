import {UpdateQuery} from 'mongoose';
import PuzzleSet from '@/models/puzzle-set-model';
import type {UserInterface, PuzzleSetInterface} from '@/types/models';

export {create} from '@/controllers/set-create';

export const retrieve = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> =>
	PuzzleSet.findById(id).exec() as Promise<PuzzleSetInterface>;

export const retrieveByUser = async (
	user: UserInterface['id'],
): Promise<PuzzleSetInterface[]> =>
	PuzzleSet.find({user}).exec() as Promise<PuzzleSetInterface[]>;

export const update = async (
	id: PuzzleSetInterface['id'],
	body: UpdateQuery<Partial<PuzzleSetInterface>>,
): Promise<PuzzleSetInterface> =>
	PuzzleSet.findByIdAndUpdate(id, body, {
		new: true,
	}).exec() as Promise<PuzzleSetInterface>;

export const remove = async (
	id: PuzzleSetInterface['id'],
): Promise<PuzzleSetInterface> =>
	PuzzleSet.findByIdAndDelete(id).exec() as Promise<PuzzleSetInterface>;
