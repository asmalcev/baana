import { ConfigType } from './react/LineContext';

export type Point = [number, number];
export type PointObj = { x: number; y: number };

export const c_bezier = (
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point,
    t: number
) => [
    (1 - t) ** 3 * p1[0] +
        3 * (1 - t) ** 2 * t * p2[0] +
        3 * (1 - t) * t ** 2 * p3[0] +
        t ** 3 * p4[0],
    (1 - t) ** 3 * p1[1] +
        3 * (1 - t) ** 2 * t * p2[1] +
        3 * (1 - t) * t ** 2 * p3[1] +
        t ** 3 * p4[1],
];

export const comparePointObjects = (a: PointObj, b: PointObj) =>
    a.x === b.x && a.y === b.y;

export type SVGProps = {
    center: Point;
    d: (string | number)[];
};

export const getSVGProps = (
    start: PointObj,
    end: PointObj,
    curviness: number = 1
) => {
    let diffX = end.x - start.x;
    const diffY = end.y - start.y;

    const svgProps: SVGProps = {
        center: [0, 0],
        d: [],
    };

    if (diffX > 0) {
        /**
         * diffX > 0
         */
        const offsetX = (Math.abs(diffY) / 2) * curviness;

        svgProps.center = [start.x + Math.abs(diffX) / 2, start.y + diffY / 2];

        const dots: Point[] = [
            [start.x, start.y],
            [start.x + offsetX, start.y],
            [end.x - offsetX, end.y],
            [end.x, end.y],
            svgProps.center,
        ];

        svgProps.d = [
            'M',
            dots[0][0],
            dots[0][1],
            'C',
            dots[1][0],
            dots[1][1],
            dots[2][0],
            dots[2][1],
            dots[3][0],
            dots[3][1],
        ];
    } else if (diffY === 0 || Math.abs(diffX / diffY) > 4) {
        /**
         * start.y ~= end.y && diffX < 0
         */
        const offsetX = Math.log(Math.abs(diffX)) * 50 * curviness;
        const offsetY =
            (Math.abs(diffY) + 110) *
            (diffY === 0 ? -1 : Math.sign(diffY)) *
            curviness;

        const dots: Point[] = [
            [start.x, start.y],
            [start.x + offsetX, start.y + offsetY],
            [end.x - offsetX, start.y + offsetY],
            [end.x, end.y],
        ];

        svgProps.center = c_bezier(
            dots[0],
            dots[1],
            dots[2],
            dots[3],
            0.5
        ) as Point;
        dots.push(svgProps.center);

        svgProps.d = [
            'M',
            dots[0][0],
            dots[0][1],
            'C',
            dots[1][0],
            dots[1][1],
            dots[2][0],
            dots[2][1],
            dots[3][0],
            dots[3][1],
        ];
    } else {
        /**
         * diffX < 0
         */

        if (diffX > -10) {
            diffX = -10;
        }

        const offsetX = Math.log(Math.abs(diffX)) * 40 * curviness;

        svgProps.center = [
            start.x - Math.abs(diffX) / 2,
            start.y + (Math.abs(diffY) / 2) * Math.sign(diffY),
        ];

        const dots: Point[] = [
            [start.x, start.y],
            [start.x + offsetX, start.y],
            svgProps.center,
            [end.x - offsetX, end.y],
            [end.x, end.y],
        ];

        svgProps.d = [
            'M',
            dots[0][0],
            dots[0][1],
            'Q',
            dots[1][0],
            dots[1][1],
            dots[2][0],
            dots[2][1],
            'Q',
            dots[3][0],
            dots[3][1],
            dots[4][0],
            dots[4][1],
        ];
    }

    return svgProps;
};

const uniqueIdGeneratorFactory = (prefix: string) => {
    let i = 0;
    return () => `${prefix}-${i++}`;
};

export const uniqueMarkerId = uniqueIdGeneratorFactory('marker');
export const uniqueLineId = uniqueIdGeneratorFactory('line');

const DEFAULT_HOVER_SIZE = 20;

export const computeHoverStrokeWidth = (
    strokeWidth: number,
    scale: number = 1,
    hoverSize: number = DEFAULT_HOVER_SIZE
) => {
    if (strokeWidth === 0) return 0;
    if (scale < 1) return hoverSize;
    return strokeWidth * scale > hoverSize ? strokeWidth : hoverSize / scale;
};

export const reversePath = (d: SVGProps['d']) => {
    const opQueue = [];
    const pStack = [];

    let i = 0;
    for (const el of d) {
        if (typeof el === 'string') {
            opQueue.push(el);
        } else {
            if (i % 2 === 0) {
                pStack.push([el]);
            } else {
                pStack[pStack.length - 1].push(el);
            }
            i++;
        }
    }

    const expectedPointsCount: Record<string, number> = {
        M: 1,
        C: 3,
        Q: 2,
    };

    const result: SVGProps['d'] = [];

    i = pStack.length - 1;
    for (const cmd of opQueue) {
        result.push(cmd);
        for (let j = 0; j < expectedPointsCount[cmd]; j++) {
            result.push(...pStack[i--]);
        }
    }

    return result;
};

export const update = (
    startRef: HTMLElement,
    endRef: HTMLElement,
    parent: HTMLElement,
    offset: ConfigType['offset'],
    scale: ConfigType['scale'] = 1,
    onlyIntegerCoords: ConfigType['onlyIntegerCoords'] = false
) => {
    const rect1 = startRef.getBoundingClientRect();
    const rect2 = endRef.getBoundingClientRect();

    const containerRect = parent.getBoundingClientRect();

    const start = {
        x:
            (rect1.x +
                rect1.width +
                (offset?.start?.[0] ?? 0) -
                containerRect.x) /
            (scale ?? 1),
        y:
            (rect1.y +
                rect1.height / 2 +
                (offset?.start?.[1] ?? 0) -
                containerRect.y) /
            (scale ?? 1),
    };

    const end = {
        x: (rect2.x + (offset?.end?.[0] ?? 0) - containerRect.x) / (scale ?? 1),
        y:
            (rect2.y +
                rect2.height / 2 +
                (offset?.end?.[1] ?? 0) -
                containerRect.y) /
            (scale ?? 1),
    };

    if (onlyIntegerCoords) {
        start.x = Math.floor(start.x);
        start.y = Math.floor(start.y);
        end.x = Math.floor(end.x);
        end.y = Math.floor(end.y);
    }

    return [start, end];
};
