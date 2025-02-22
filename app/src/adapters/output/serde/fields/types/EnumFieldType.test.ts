import {describe, it} from '@jest/globals';
import {EnumFieldType} from './EnumFieldType';

describe('EnumFieldType', () => {
	const enumValues = ['VALUE1', 'VALUE2', 'VALUE3'];
	const enumFieldType = new EnumFieldType(enumValues);

	it('deserializes valid enum value', async () => {
		const result = await enumFieldType.de(null, 'VALUE1');
		expect(result).toBe('VALUE1');
	});

	it('throws error on invalid enum value', async () => {
		await expect(enumFieldType.de(null, 'INVALID')).rejects.toThrow('Invalid enum value: INVALID');
	});

	it('serializes enum value', () => {
		const result = enumFieldType.ser(null, 'VALUE2');
		expect(result).toBe('VALUE2');
	});
});
