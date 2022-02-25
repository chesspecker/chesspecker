import handler from '@/api/user/index';

beforeAll(async () => await mockDb.connect());
afterEach(async () => await mockDb.clear());
afterAll(async () => await mockDb.close());

describe('api/user', () => {
	describe('get', () => {
		it('should return user', () => {
			expect(true).toBe(true);
		});
	});
	describe('post', () => {
		it('should be true', () => {
			expect(true).toBe(true);
		});
	});
	describe('put', () => {
		it('should update user', () => {
			expect(true).toBe(true);
		});
	});
	describe('delete', () => {
		it('should delete user', () => {
			expect(true).toBe(true);
		});
	});
});
