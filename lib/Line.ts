import { Marker } from '.';
import { Point, PointObj, comparePointObjects, getSVGProps } from './utils';

export type WithSetPos = {
    setPos(x: number, y: number): void;
};

export type LinePropsType = {
    svg: Line['svg'];

    marker?: Line['marker'];
    label?: Line['label'];

    scale?: Line['scale'];
    offset?: Line['offset'];
    curviness?: Line['curviness'];
    hoverArea?: Line['hoverArea'];
    className?: Line['className'];
    strokeColor?: Line['strokeColor'];

    onClick?: Line['onClick'];
    onHover?: Line['onHover'];
};

export class Line {
    svg: SVGElement;
    path: SVGPathElement;
    hoverPath: SVGPathElement;
    
    lastStart: PointObj | null;
    lastEnd: PointObj | null;
    
    label?: WithSetPos;
    marker?: Marker;
    
    scale?: number;
    curviness?: number;
    className?: string;
    hoverArea?: number;
    strokeColor: string;
    offset?: {
        start: Point;
        end: Point;
    };

    onClick?: (e?: MouseEvent) => void;
    onHover?: (e?: MouseEvent) => void;

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
        Object.assign(this, {
            scale,
            marker,
            curviness,
            className,
            strokeColor,
            offset: {
                start: [0, 0],
                end: [0, 0],
                ...offset,
            },
            onHover,
            onClick,
        });
        this.svg = svg;
        this.strokeColor = strokeColor;

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

        this.config({
            className: true,
            marker: true,
            path: true,
            hoverPath: true,
        });

        this.svg.appendChild(this.path);
        this.svg.appendChild(this.hoverPath);

        this.lastStart = null;
        this.lastEnd = null;

        this.label = label;
    }

    config({
        className,
        marker,
        path,
        hoverPath,
    }: {
        className?: boolean;
        marker?: boolean;
        path?: boolean;
        hoverPath?: boolean;
    }) {
        if (path) {
            this.path.setAttributeNS(null, 'stroke', this.strokeColor);
            this.path.setAttributeNS(null, 'fill', 'none');
        }

        if (className && this.className) {
            this.path.classList.remove(...this.path.classList);
            this.path.classList.add(this.className);
        }

        if (marker && this.marker) {
            this.path.setAttributeNS(
                null,
                'marker-end',
                `url(#${this.marker.id})`
            );
        }

        if (hoverPath) {
            if (this.onHover || this.onClick) {
                this.hoverPath.classList.add(
                    'baana__interactive-path'
                );
            }

            this.configOnHover(this.onHover);
            this.configOnClick(this.onClick);
        }
    }

    configOnHover(onHover: Line['onHover']) {
        if (onHover) {
            if (this.onHover) {
                this.hoverPath.removeEventListener('mouseover', this.onHover);
            }
            this.hoverPath.addEventListener('mouseover', onHover);
            this.onHover = onHover;
        }
    }

    configOnClick(onClick: Line['onHover']) {
        if (onClick) {
            if (this.onClick) {
                this.hoverPath.removeEventListener('click', this.onClick);
            }
            this.hoverPath.addEventListener('click', onClick);
            this.onClick = onClick;
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
