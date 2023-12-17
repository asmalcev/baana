import { describe, expect, it } from 'vitest';

import { reversePath } from './utils';

describe('reversePath', () => {
    it('reverse empty array', () => {
        expect(reversePath([])).toEqual([]);
    });

    it('reverse array with M', () => {
        expect(reversePath(['M', 10, 10])).toEqual(['M', 10, 10]);
    });

    it('reverse array with Q', () => {
        expect(reversePath(['Q', 10, 10, 20, 20])).toEqual([
            'Q',
            20,
            20,
            10,
            10,
        ]);
    });

    it('reverse array with C', () => {
        expect(reversePath(['C', 10, 10, 20, 20, 30, 30])).toEqual([
            'C',
            30,
            30,
            20,
            20,
            10,
            10,
        ]);
    });

    it('reverse array with M and Q', () => {
        expect(reversePath(['M', 10, 10, 'Q', 20, 20, 30, 30])).toEqual([
            'M',
            30,
            30,
            'Q',
            20,
            20,
            10,
            10,
        ]);
    });

    it('reverse array with M and C', () => {
        expect(reversePath(['M', 10, 10, 'C', 20, 20, 30, 30, 40, 40])).toEqual(
            ['M', 40, 40, 'C', 30, 30, 20, 20, 10, 10]
        );
    });

    it('reverse array with M, Q and C', () => {
        expect(
            reversePath([
                'M',
                10,
                10,
                'Q',
                20,
                20,
                30,
                30,
                'C',
                40,
                40,
                50,
                50,
                60,
                60,
            ])
        ).toEqual([
            'M',
            60,
            60,
            'Q',
            50,
            50,
            40,
            40,
            'C',
            30,
            30,
            20,
            20,
            10,
            10,
        ]);
    });
});
