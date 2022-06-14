import {mongoose} from '@typegoose/typegoose';

export type Ref<T> = T | mongoose.Types.ObjectId;
