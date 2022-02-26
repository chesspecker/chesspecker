import mockingoose from 'mockingoose';
import handler from '@/api/user/index';
import puzzleController from '@/controllers/puzzle';

describe('api/puzzle', () => {
	describe('post', () => {
		it('should be true', () => {
			puzzleController.create();
			expect(true).toBe(true);
		});
	});
	describe('get', () => {
		it('should be true', () => {
			puzzleController.retrieve();
			expect(true).toBe(true);
		});
	});
	describe('put', () => {
		it('should be true', () => {
			expect(true).toBe(true);
		});
	});
	describe('delete', () => {
		it('should be true', () => {
			expect(true).toBe(true);
		});
	});
});
