export interface ErrorData {
	success: false;
	error: string;
}

export interface SuccessData<T> {
	success: true;
	data: T;
}
