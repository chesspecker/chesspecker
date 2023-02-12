import type {NextApiResponse} from 'next';
import type {ErrorData} from '@/types/data';

export const failWrapper =
	(response: NextApiResponse<ErrorData>) =>
	(error: string, status = 500): void => {
		console.error('Error:', error);
		response.status(status).json({success: false, error});
	};
