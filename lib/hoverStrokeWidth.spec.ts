import { describe, expect, it } from 'vitest';

import { computeHoverStrokeWidth } from './utils';

describe('computeHoverStrokeWidth', () => {
    it('should return 0 if gets 0', () => {
        // strokeWidth = 0 => 0
        expect(computeHoverStrokeWidth(0)).toEqual(0);
    });

    it('should return 0 if gets 0 [scaled]', () => {
        // strokeWidth = 0 => 0
        expect(computeHoverStrokeWidth(0, 2)).toEqual(0);
    });

    it('should return 0 if gets 0 [scaled, custom maxHoverSize]', () => {
        // strokeWidth = 0 => 0
        expect(computeHoverStrokeWidth(0, 2, 10)).toEqual(0);
    });

    it('should return maxHoverSize (default = 20)', () => {
        // 10 * 1 < 20 => 20 / 1 = 20
        expect(computeHoverStrokeWidth(10)).toEqual(20);
    });

    it('should return maxHoverSize (default = 20) / scale [scaled]', () => {
        // 8 * 2 < 20 => 20 / 2 = 10
        expect(computeHoverStrokeWidth(8, 2)).toEqual(10);
    });

    it('should return maxHoverSize / scale [scaled, custom maxHoverSize]', () => {
        // 4 * 2 < 20 => 20 / 2 = 10
        expect(computeHoverStrokeWidth(4, 2, 10)).toEqual(5);
    });

    it('should return strokeWidth', () => {
        // 24 * 1 > 20 => 24
        expect(computeHoverStrokeWidth(24)).toEqual(24);
    });

    it('should return strokeWidth [scaled]', () => {
        // 12 * 2 > 20 => 12
        expect(computeHoverStrokeWidth(12, 2)).toEqual(12);
    });

    it('should return strokeWidth [scaled, custom maxHoverSize]', () => {
        // 8 * 2 > 10 => 8
        expect(computeHoverStrokeWidth(8, 2, 10)).toEqual(8);
    });

    it('should return maxHoverSize (default = 20) [scaled]', () => {
        // 0.5 < 1 => 20
        expect(computeHoverStrokeWidth(8, 0.5)).toEqual(20);
    });

    it('should return custom maxHoverSize [scaled, custom maxHoverSize]', () => {
        // 0.5 < 1 => 10
        expect(computeHoverStrokeWidth(8, 0.5, 10)).toEqual(10);
    });
});
