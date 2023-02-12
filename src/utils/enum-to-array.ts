export const enumToArray = <T>(enumValue: {[x: string]: T}) =>
	Object.keys(enumValue).map(key => enumValue[key]);
