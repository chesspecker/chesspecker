import {NextApiRequest, NextApiResponse} from 'next';
import withMongoRoute from 'providers/mongoose';

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
      'totalSetCompleted': 0, 
      'totalTimePlayed': 0, 
      'streak': {
        'currentCount': 0, 
        'startDate': '11/05/2022', 
        'lastLoginDate': '11/05/2022'
      }
    }
  }
]

// prettier-ignore
const updatePuzzleSet = [
  {
    '$unset': [
      'chunkLength', 'bestTime', 'totalMistakes', 'totalPuzzlesPlayed', 'accuracy', 'puzzles.grade', 'puzzles.mistakes', 'puzzles.timeTaken', 'puzzles.interval', 'puzzles.repetition', 'puzzles.easinessFactor'
    ]
  }, {
    '$set': {
      'times': [], 
      'cycles': 0, 
      'currentTime': 0, 
      'progress': 0, 
      'puzzles.mistakes': [], 
      'puzzles.grades': [], 
      'puzzles.timeTaken': [], 
      'puzzles.count': 0, 
      'puzzles.streak': 0
    }
  }
]

const migrationRoute = (
	_request: NextApiRequest,
	response: NextApiResponse,
) => {
	response.send({updatePuzzleSet, updateUser});
};

export default withMongoRoute(migrationRoute);
