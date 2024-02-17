import * as fs from 'fs';
import { strict as assert } from 'assert';

describe('Test Directory Content Equality', () => {
	it('should check if Test and Tests_Result directories have the same content', () => {
		const testDir = fs.readdirSync('__tests__/Tests');
		const testResultDir = fs.readdirSync('__tests__/Tests_Result/Tests');

		assert.strictEqual(testDir.length, testResultDir.length, 'Number of files is different');

		testDir.forEach((file) => {
			assert.ok(testResultDir.includes(file), `${file} not found in Tests_Result directory`);
		});
	});
});
