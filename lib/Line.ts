import { Marker } from '.';
import { PointObj, comparePointObjects, getSVGProps } from './utils';

interface Label {
    setPos(x: number, y: number): void;
}

export class Line {
    strokeColor: string;

    svg: SVGElement;
    path: SVGPathElement;
    container: HTMLElement;

    lastStart: PointObj | null;
    lastEnd: PointObj | null;

    label?: Label;

    constructor({
        container,
        marker,
        label,
        strokeColor = 'black',
    }: {
        container: HTMLElement;
        marker?: Marker;
        label?: Label;
        strokeColor: string;
    }) {
        this.strokeColor = strokeColor;

        this.svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        this.svg.style.position = 'absolute';
        this.svg.style.zIndex = '-1';

        this.path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        this.config();
        if (marker) {
            this.path.setAttributeNS(null, 'marker-end', `url(#${marker.id})`);
        }
        this.svg.appendChild(this.path);

        this.container = container;
        this.container.appendChild(this.svg);

        this.lastStart = null;
        this.lastEnd = null;

        this.label = label;
    }

    config() {
        this.path.setAttributeNS(null, 'stroke', this.strokeColor);
        this.path.setAttributeNS(null, 'fill', 'transparent');
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

        const svgProps = getSVGProps(start, end);

        this.svg.style['top'] = `${svgProps.rect.y}px`;
        this.svg.style['left'] = `${svgProps.rect.x}px`;
        this.svg.style['width'] = `${svgProps.rect.width}px`;
        this.svg.style['height'] = `${svgProps.rect.height}px`;

        this.path.setAttributeNS(null, 'd', svgProps.d);

        this.lastStart = start;
        this.lastEnd = end;

        if (this.label) {
            this.label.setPos(svgProps.center[0], svgProps.center[1]);
        }
    }
}
