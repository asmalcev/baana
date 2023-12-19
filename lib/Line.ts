import { Marker } from '.';
import { LabelInterface } from './Label';
import {
    Point,
    PointObj,
    comparePointObjects,
    computeHoverStrokeWidth,
    getSVGProps,
    reversePath,
} from './utils';

export type LinePropsType = {
    svg: Line['svg'];

    marker?: Line['marker'];
    label?: Line['label'];

    scale?: Line['scale'];
    offset?: Line['offset'];
    curviness?: Line['curviness'];
    strokeWidth?: Line['strokeWidth'];
    className?: Line['className'];
    strokeColor?: Line['strokeColor'];

    onClick?: Line['onClick'];
    onHover?: Line['onHover'];

    onlyIntegerCoords?: Line['onlyIntegerCoords'];
};

export class Line {
    svg: SVGElement;
    path: SVGPathElement;
    hoverPath?: SVGPathElement;

    lastStart: PointObj | null;
    lastEnd: PointObj | null;

    label?: LabelInterface;
    marker?: Marker;

    scale?: number;
    curviness?: number;
    className?: string;
    strokeColor: string;
    strokeWidth: number;
    offset: {
        start: Point;
        end: Point;
    };

    hoverStrokeWidth?: number;

    onClick?: (e?: MouseEvent) => void;
    onHover?: (e?: MouseEvent) => void;

    onlyIntegerCoords?: boolean;

    constructor({
        svg,
        label,
        marker,
        offset,

        scale = 1,
        curviness = 1,
        className = '',
        strokeColor = 'black',
        strokeWidth = 1,

        onlyIntegerCoords = false,

        onHover,
        onClick,
    }: LinePropsType) {
        this.svg = svg;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.onHover = onHover;
        this.onClick = onClick;

        this.onlyIntegerCoords = onlyIntegerCoords;

        this.path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        this.svg.appendChild(this.path);

        this.offset = {
            start: [0, 0],
            end: [0, 0],
            ...offset,
        };

        this.configScale(scale);
        this.configCurviness(curviness);

        this.configOnHover(onHover);
        this.configOnClick(onClick);

        this.config({
            path: true,
            hoverPath: Boolean(this.hoverPath),
        });
        this.configMarker(marker);
        this.configClassName(className);

        this.lastStart = null;
        this.lastEnd = null;

        this.label = label;
    }

    config({ path, hoverPath }: { path?: boolean; hoverPath?: boolean }) {
        if (path) {
            this.path.setAttributeNS(null, 'stroke', this.strokeColor);
            this.path.setAttributeNS(
                null,
                'stroke-width',
                String(this.strokeWidth)
            );
            this.path.setAttributeNS(null, 'fill', 'none');
        }

        if (hoverPath && this.hoverPath) {
            this.hoverPath.setAttributeNS(
                null,
                'stroke-width',
                String(this.hoverStrokeWidth)
            );
        }
    }

    render(start: PointObj, end: PointObj) {
        const svgProps = getSVGProps(start, end, this.curviness);

        let d = '';
        if (this.onlyIntegerCoords) {
            d = svgProps.d
                .map((e) => (typeof e === 'number' ? Math.floor(e) : e))
                .join(' ');
        } else {
            d = svgProps.d.join(' ');
        }

        this.path.setAttributeNS(null, 'd', d);
        this.hoverPath?.setAttributeNS(
            null,
            'd',
            d + reversePath(svgProps.d).join(' ')
        );

        this.lastStart = start;
        this.lastEnd = end;

        if (this.label) {
            this.label.setPos(svgProps.center[0], svgProps.center[1]);
        }
    }

    update(startRef: HTMLElement, endRef: HTMLElement) {
        if (!this.svg || !this.svg.parentNode) return;
        const rect1 = startRef.getBoundingClientRect();
        const rect2 = endRef.getBoundingClientRect();

        const containerRect = (
            this.svg.parentNode as HTMLElement
        ).getBoundingClientRect();

        const start = {
            x:
                (rect1.x +
                    rect1.width +
                    (this.offset?.start?.[0] ?? 0) -
                    containerRect.x) /
                (this.scale ?? 1),
            y:
                (rect1.y +
                    rect1.height / 2 +
                    (this.offset?.start?.[1] ?? 0) -
                    containerRect.y) /
                (this.scale ?? 1),
        };

        const end = {
            x:
                (rect2.x + (this.offset?.end?.[0] ?? 0) - containerRect.x) /
                (this.scale ?? 1),
            y:
                (rect2.y +
                    rect2.height / 2 +
                    (this.offset?.end?.[1] ?? 0) -
                    containerRect.y) /
                (this.scale ?? 1),
        };

        if (this.onlyIntegerCoords) {
            start.x = Math.floor(start.x);
            start.y = Math.floor(start.y);
            end.x = Math.floor(end.x);
            end.y = Math.floor(end.y);
        }

        if (
            this.lastStart &&
            this.lastEnd &&
            comparePointObjects(start, this.lastStart) &&
            comparePointObjects(end, this.lastEnd)
        ) {
            return;
        }

        this.render(start, end);
    }

    remove() {
        this.svg.removeChild(this.path);
        this.removeHoverPath();
    }

    configHoverPath() {
        this.hoverStrokeWidth = this.strokeWidth
            ? computeHoverStrokeWidth(this.strokeWidth, this.scale)
            : undefined;

        const shouldCreateHoverPath =
            this.hoverStrokeWidth &&
            this.hoverStrokeWidth > 0 &&
            Boolean(this.onHover || this.onClick);
        const hadHoverPath = Boolean(this.hoverPath);

        if (!hadHoverPath && shouldCreateHoverPath) {
            this.createHoverPath();
            const d = this.path.getAttributeNS(null, 'd');
            if (d) {
                this.hoverPath?.setAttributeNS(null, 'd', d);
            }
        } else if (hadHoverPath && !shouldCreateHoverPath) {
            this.removeHoverPath();
        }

        if (this.hoverStrokeWidth) {
            this.config({ hoverPath: true });
        }
    }

    createHoverPath() {
        if (!this.hoverStrokeWidth) return;

        this.hoverPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        this.hoverPath.setAttributeNS(null, 'stroke', 'none');
        this.hoverPath.setAttributeNS(null, 'fill', 'none');
        this.hoverPath.classList.add('baana__interactive-path');
        this.svg.appendChild(this.hoverPath);
    }

    removeHoverPath() {
        if (!this.hoverPath) return;

        this.svg.removeChild(this.hoverPath);
        this.hoverPath = undefined;
    }

    /**
     * RENDER OPTIONS
     */
    configOffset(offset: Line['offset']) {
        this.offset = {
            ...this.offset,
            ...offset,
        };
    }

    configScale(scale: Line['scale']) {
        this.scale = scale;
    }

    configCurviness(curviness: Line['curviness']) {
        this.curviness = curviness;
        if (this.lastStart && this.lastEnd) {
            this.render(this.lastStart, this.lastEnd);
        }
    }

    /**
     * CLASSNAME
     */
    configClassName(className: Line['className']) {
        this.className = className;
        this.path.classList.remove(...this.path.classList);
        if (this.className) {
            this.path.classList.add(...this.className.split(' '));
        }
    }

    /**
     * PATH
     */
    configStrokeColor(strokeColor: Line['strokeColor']) {
        this.strokeColor = strokeColor;
        this.config({ path: true });
    }

    configStrokeWidth(strokeWidth: Line['strokeWidth']) {
        this.strokeWidth = strokeWidth;
        this.config({ path: true });
    }

    configOnHover(onHover: Line['onHover']) {
        if (this.onHover) {
            this.hoverPath?.removeEventListener('mouseover', this.onHover);
        }

        this.onHover = onHover;
        this.configHoverPath();

        if (!this.hoverPath) return;

        if (onHover) {
            this.hoverPath.addEventListener('mouseover', onHover);
        }
    }

    configOnClick(onClick: Line['onHover']) {
        if (this.onClick) {
            this.hoverPath?.removeEventListener('click', this.onClick);
        }

        this.onClick = onClick;
        this.configHoverPath();

        if (!this.hoverPath) return;

        if (onClick) {
            this.hoverPath.addEventListener('click', onClick);
        }
    }

    /**
     * MARKER
     */
    configMarker(marker: Line['marker']) {
        this.marker = marker;
        this.path.setAttributeNS(
            null,
            'marker-end',
            this.marker ? `url(#${this.marker.id})` : ''
        );
    }

    /**
     * OPTIMIZATIONS
     */
    configonlyIntegerCoords(onlyIntegerCoords: Line['onlyIntegerCoords']) {
        this.onlyIntegerCoords = onlyIntegerCoords;
    }
}
