import { Marker } from '.';
import { Point, PointObj, comparePointObjects, getSVGProps } from './utils';

export type WithSetPos = {
    setPos(x: number, y: number): void;
};

export type LinePropsType = {
    svg: SVGElement;

    marker?: Marker;
    label?: WithSetPos;

    strokeColor?: string;

    curviness?: number;
    scale?: number;

    className?: string;
    offset?: {
        start: Point;
        end: Point;
    };

    onClick?: () => {};
    onHover?: () => {};
};

export class Line {
    strokeColor: string;

    svg: SVGElement;
    path: SVGPathElement;
    hoverPath: SVGPathElement;

    lastStart: PointObj | null;
    lastEnd: PointObj | null;

    label?: WithSetPos;
    marker?: Marker;

    curviness?: number;
    scale?: number;

    className?: string;
    offset?: {
        start: Point;
        end: Point;
    };

    constructor({
        svg,
        label,
        marker,
        offset,

        scale = 1,
        curviness = 1,
        className = '',
        strokeColor = 'black',

        onHover,
        onClick,
    }: LinePropsType) {
        this.svg = svg;
        this.scale = scale;
        this.curviness = curviness;
        this.className = className;
        this.strokeColor = strokeColor;
        this.marker = marker;
        this.offset = {
            start: [0, 0],
            end: [0, 0],
            ...offset,
        };

        this.path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );

        this.hoverPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        this.hoverPath.setAttributeNS(null, 'stroke', 'transparent');
        this.hoverPath.setAttributeNS(null, 'fill', 'none');

        if (onHover || onClick) {
            this.hoverPath.classList.add('svg-curve-arrow__interactive-path');
        }
        if (onHover) {
            this.hoverPath.addEventListener('mouseover', onHover);
        }
        if (onClick) {
            this.hoverPath.addEventListener('click', onClick);
        }

        this.config();

        this.svg.appendChild(this.path);
        this.svg.appendChild(this.hoverPath);

        this.lastStart = null;
        this.lastEnd = null;

        this.label = label;
    }

    config() {
        this.path.setAttributeNS(null, 'stroke', this.strokeColor);
        this.path.setAttributeNS(null, 'fill', 'none');

        if (this.className) {
            this.path.classList.remove(...this.path.classList);
            this.path.classList.add(this.className);
        }

        if (this.marker) {
            this.path.setAttributeNS(null, 'marker-end', `url(#${this.marker.id})`);
        }
    }

    render(start: PointObj, end: PointObj) {
        if (
            this.lastStart &&
            this.lastEnd &&
            comparePointObjects(start, this.lastStart) &&
            comparePointObjects(end, this.lastEnd)
        ) {
            return;
        }

        const svgProps = getSVGProps(start, end, this.curviness);

        this.path.setAttributeNS(null, 'd', svgProps.d);
        this.hoverPath.setAttributeNS(null, 'd', svgProps.d);

        this.lastStart = start;
        this.lastEnd = end;

        if (this.label) {
            this.label.setPos(svgProps.center[0], svgProps.center[1]);
        }
    }

    update(startRef: HTMLElement, endRef: HTMLElement) {
        const rect1 = startRef.getBoundingClientRect();
        const rect2 = endRef.getBoundingClientRect();

        const start = {
            x: rect1.x + rect1.width + (this.offset?.start?.[0] ?? 0),
            y: rect1.y + rect1.height / 2 + (this.offset?.start?.[1] ?? 0),
        };

        const end = {
            x: rect2.x + (this.offset?.end?.[0] ?? 0),
            y: rect2.y + rect2.height / 2 + (this.offset?.end?.[1] ?? 0),
        };

        this.render(start, end);
    }
}
