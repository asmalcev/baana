import { describe, expect, it } from 'vitest';

import { computeHoverStrokeWidth } from './utils';

describe('computeHoverStrokeWidth', () => {
    it('should return 0 if gets 0', () => {
        expect(computeHoverStrokeWidth(0)).toEqual(0);
    });

    it('should return 0 if gets 0 (scaled)', () => {
        expect(computeHoverStrokeWidth(0, 2)).toEqual(0);
    });

    it('should return 0 if gets 0 (scaled, custom maxHoverSize)', () => {
        expect(computeHoverStrokeWidth(0, 2, 10)).toEqual(0);
    });

    it('should return passed strokeWidth if it is less than maxHoverSize (default = 20)', () => {
        expect(computeHoverStrokeWidth(10)).toEqual(10);
    });

    it('should return scaled strokeWidth if it less than maxHoverSize (default = 20)', () => {
        expect(computeHoverStrokeWidth(8, 2)).toEqual(16);
    });

    it('should return scaled strokeWidth if it less than custom maxHoverSize = 10', () => {
        expect(computeHoverStrokeWidth(4, 2, 10)).toEqual(8);
    });

    it('should return 0 if strokeWidth more than maxHoverSize (default = 20)', () => {
        expect(computeHoverStrokeWidth(24)).toEqual(0);
    });

    it('should return 0 if scaled strokeWidth more than maxHoverSize (default = 20)', () => {
        expect(computeHoverStrokeWidth(12, 2)).toEqual(0);
    });

    it('should return 0 if scaled strokeWidth more than custom maxHoverSize = 10', () => {
        expect(computeHoverStrokeWidth(8, 2, 10)).toEqual(0);
    });
});
