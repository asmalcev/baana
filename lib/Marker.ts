const _defaultSize: number = 12;

export type MarkerPropsType = {
    svg: SVGElement;
    id?: string;
    size?: number;
    fillColor?: string;
};

export class Marker {
    size: number;
    fillColor: string;

    svg: SVGElement;
    defs: SVGDefsElement;
    marker: SVGMarkerElement;
    path: SVGPathElement;

    id: string;

    constructor({
        svg,
        id = 'arrow-head',
        size = _defaultSize,
        fillColor = 'context-stroke',
    }: MarkerPropsType) {
        this.size = size;
        this.fillColor = fillColor;
        this.svg = svg;

        this.marker = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'marker'
        );
        this.marker.setAttributeNS(null, 'id', id);
        this.marker.setAttributeNS(null, 'orient', 'auto');

        this.path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );

        this.config({
            color: true,
            size: true,
        });

        this.marker.appendChild(this.path);

        const defsFromSvg = Array.from(this.svg.childNodes).find(el => el.nodeName === 'defs');
        if (defsFromSvg) {
            this.defs = defsFromSvg as SVGDefsElement;
        } else {
            this.defs = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'defs'
            );
        }

        this.defs.appendChild(this.marker);
        this.svg.appendChild(this.defs);

        this.id = id;
    }

    config({ color, size }: { color?: boolean; size?: boolean }) {
        if (color) {
            this.path.setAttributeNS(null, 'fill', this.fillColor);
        }

        if (size) {
            const scale = this.size / _defaultSize;

            this.marker.setAttributeNS(null, 'markerWidth', String(12 * scale));
            this.marker.setAttributeNS(
                null,
                'markerHeight',
                String(10 * scale)
            );
            this.marker.setAttributeNS(null, 'refX', String(11 * scale));
            this.marker.setAttributeNS(null, 'refY', String(5 * scale));

            this.path.setAttributeNS(
                null,
                'd',
                `M0,0 V${10 * scale} L${12 * scale},${5 * scale} Z`
            );
        }
    }

    setFillColor(fillColor?: string) {
        if (!fillColor) return;
        this.fillColor = fillColor;
        this.config({ color: true });
    }

    setSize(size: number = 12) {
        this.size = size;
        this.config({ size: true });
    }

    remove() {
        if (this.defs.childNodes.length === 1) {
            this.svg.removeChild(this.defs);
        } else {
            this.defs.removeChild(this.marker);
        }
    }
}