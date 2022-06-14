import {prop} from '@typegoose/typegoose';

export class ThemeItem {
	@prop()
	public title: string;

	@prop()
	public count: number;
}
