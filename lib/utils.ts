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

export const getRect = (minXY: Point, maxXY: Point, svgOffset: number) => ({
    x: minXY[0] - svgOffset,
    y: minXY[1] - svgOffset,
    width: maxXY[0] + svgOffset * 2 - minXY[0],
    height: maxXY[1] + svgOffset * 2 - minXY[1],
});

export const comparePointObjects = (a: PointObj, b: PointObj) =>
    JSON.stringify(a) === JSON.stringify(b);

export type SVGProps = {
    center: Point;
    rect: ReturnType<typeof getRect>;
    d: string;
};

export const getSVGProps = (start: PointObj, end: PointObj) => {
    let diffX = end.x - start.x;
    let diffY = end.y - start.y;

    const svgProps: SVGProps = {
        center: [0, 0],
        rect: { x: 0, y: 0, width: 0, height: 0 },
        d: '',
    };
    const svgOffset = 10;

    if (diffX > 0) {
        /**
         * diffX > 0
         */
        const offsetX = Math.abs(diffY) / 2;

        svgProps.center = [start.x + Math.abs(diffX) / 2, start.y + diffY / 2];

        const dots: Point[] = [
            [start.x, start.y],
            [start.x + offsetX, start.y],
            [end.x - offsetX, end.y],
            [end.x, end.y],
            svgProps.center,
        ];

        const minXY: Point = [
            Math.min(dots[0][0], dots[2][0]),
            Math.min(dots[0][1], dots[3][1]),
        ];
        const maxXY: Point = [
            Math.max(dots[1][0], dots[3][0]),
            Math.max(dots[0][1], dots[3][1]),
        ];

        svgProps.rect = getRect(minXY, maxXY, svgOffset);

        svgProps.d = `
            M ${dots[0][0] - svgProps.rect.x} ${dots[0][1] - svgProps.rect.y}
            C ${dots[1][0] - svgProps.rect.x} ${dots[1][1] - svgProps.rect.y},
            ${dots[2][0] - svgProps.rect.x} ${dots[2][1] - svgProps.rect.y},
            ${dots[3][0] - svgProps.rect.x} ${dots[3][1] - svgProps.rect.y}`;
    } else if (diffY === 0 || Math.abs(diffX / diffY) > 4) {
        /**
         * start.y ~= end.y && diffX < 0
         */
        const offsetX = Math.log(Math.abs(diffX)) * 50;
        const offsetY = (Math.abs(diffY) + 110) * (diffY === 0 ? -1: Math.sign(diffY));

        const dots: Point[] = [
            [start.x, start.y],
            [start.x + offsetX, start.y + offsetY],
            [end.x - offsetX, start.y + offsetY],
            [end.x, end.y],
        ];

        svgProps.center = c_bezier(dots[0], dots[1], dots[2], dots[3], 0.5) as Point;
        dots.push(svgProps.center);

        const minXY: Point = [
            Math.min(dots[2][0], dots[3][0]),
            Math.min(...dots.map((dot) => dot[1])),
        ];
        const maxXY: Point = [
            Math.max(dots[0][0], dots[1][0]),
            Math.max(...dots.map((dot) => dot[1])),
        ];

        svgProps.rect = getRect(minXY, maxXY, svgOffset);

        svgProps.d = `
            M ${dots[0][0] - svgProps.rect.x} ${dots[0][1] - svgProps.rect.y}
            C ${dots[1][0] - svgProps.rect.x} ${dots[1][1] - svgProps.rect.y},
            ${dots[2][0] - svgProps.rect.x} ${dots[2][1] - svgProps.rect.y},
            ${dots[3][0] - svgProps.rect.x} ${dots[3][1] - svgProps.rect.y}`;
    } else {
        /**
         * diffX < 0
         */

        if (diffX > -10) {
            diffX = -10;
        }

        const offsetX = Math.log(Math.abs(diffX)) * 40;
        const offsetY = Math.abs(diffY) / 2;

        svgProps.center = [
            start.x - Math.abs(diffX) / 2,
            start.y + offsetY * Math.sign(diffY),
        ];

        const dots: Point[] = [
            [start.x, start.y],
            [start.x + offsetX, start.y],
            svgProps.center,
            [end.x - offsetX, end.y],
            [end.x, end.y],
        ];

        const minXY: Point = [
            Math.min(dots[3][0], dots[1][0]),
            Math.min(dots[1][1], dots[3][1]),
        ];
        const maxXY: Point = [
            Math.max(dots[3][0], dots[1][0]),
            Math.max(dots[1][1], dots[3][1]),
        ];

        svgProps.rect = getRect(minXY, maxXY, svgOffset);

        svgProps.d = `
            M ${dots[0][0] - svgProps.rect.x} ${dots[0][1] - svgProps.rect.y}
            Q ${dots[1][0] - svgProps.rect.x} ${dots[1][1] - svgProps.rect.y}
            ${dots[2][0] - svgProps.rect.x} ${dots[2][1] - svgProps.rect.y}
            Q ${dots[3][0] - svgProps.rect.x} ${dots[3][1] - svgProps.rect.y}
            ${dots[4][0] - svgProps.rect.x} ${dots[4][1] - svgProps.rect.y}`;
    }

    return svgProps;
};
