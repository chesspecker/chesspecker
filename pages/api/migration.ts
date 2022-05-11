import {uptime} from 'process';
import {NextApiRequest, NextApiResponse} from 'next';

export type ResponseData = {uptime: number; message: string; timestamp: number};

// prettier-ignore
const updateUser = [
  {
    '$unset': [
      'perfs', 'permissionLevel', 'email', 'puzzleSet', 'lastUpdatedAt'
    ]
  }, {
    '$set': {
      'stripeId': null, 
      'isSponsor': false, 
      'validatedAchievements': [], 
      'puzzleSolvedByCategories': [], 
      'totalPuzzleSolved': 0, 
      'streak': {
        'currentCount': 0, 
        'startDate': '11/05/2022', 
        'lastLoginDate': '11/05/2022'
      }
    }
  }
]

const updatePuzzleSet =[
  {
    '$unset': [
      'chunkLength', 'bestTime', 'totalMistakes', 'totalPuzzlesPlayed', 'accuracy'
    ]
  }, {
    '$set': {
      'times': [], 
      'cycles': 0, 
      'currentTime': 0, 
      'progress': 0
    }
  }
]

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
