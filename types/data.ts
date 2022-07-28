export type ErrorData = {
	success: false;
	error: string;
};

export type SuccessData<T> = {
	success: true;
	data: T;
};
