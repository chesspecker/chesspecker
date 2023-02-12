import {getModelForClass, prop, mongoose, index} from '@typegoose/typegoose';
import {User} from './user';
import {PuzzleItem} from './puzzle-item';
import type {Ref} from '@/types/ref';
import {Difficulty} from '@/types/models';

@index({user: 1})
export class PuzzleSet {
	@prop({ref: () => User})
	public user?: Ref<User>;

	@prop({type: () => PuzzleItem})
	public puzzles!: PuzzleItem[];

	@prop()
	public title!: string;

	@prop()
	public length!: number;

	@prop()
	public cycles!: number;

	@prop()
	public spacedRepetition!: boolean;

	@prop()
	public currentTime!: number;

	@prop({type: () => [Number]})
	public times!: number[];

	@prop()
	public rating!: number;

	@prop()
	public progress!: number;

	@prop({enum: Difficulty, type: String})
	public level!: Difficulty;

	_id!: mongoose.Types.ObjectId;
}

const PuzzleSetModel = getModelForClass(PuzzleSet);
export default PuzzleSetModel;
