import {uptime} from 'process';
import {NextApiRequest, NextApiResponse} from 'next';

export type ResponseData = {uptime: number; message: string; timestamp: number};

const healthcheckRoute = (
	_request: NextApiRequest,
	response: NextApiResponse<ResponseData>,
) => {
	const healthcheck = {
		uptime: uptime(),
		message: 'OK',
		timestamp: Date.now(),
	};
	response.send(healthcheck);
};

export default healthcheckRoute;
