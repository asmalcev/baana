import { Label } from './Label';
import { Line, WithSetPos } from './Line';
import { Marker } from './Marker';
import { SVGContainer } from './SVG';
import { Point, uniqueMarkerId } from './utils';

export const LineFactory = ({
    svg,

    labelText,
    labelClassName,
    customLabel,

    strokeColor = 'black',

    withMarker,
    markerColor,
    markerSize,

    curviness,
    scale,
    className,

    offset,

    onClick,
    onHover,
}: {
    svg: SVGContainer;

    labelText?: string;
    labelClassName?: string;
    customLabel?: WithSetPos;

    strokeColor?: string;

    withMarker?: boolean;
    markerColor?: string;
    markerSize?: number;

    curviness?: number;
    scale?: number;
    className?: string;

    offset?: {
        start: Point;
        end: Point;
    };

    onClick?: () => {};
    onHover?: () => {};
}) => {
    const container = svg.container;
    const svgContainer = svg.svg;

    let label;
    if (!customLabel) {
        if (labelText) {
            label = new Label({
                container,
                text: labelText,
                className: labelClassName,
            });
        }
    } else {
        label = customLabel;
    }

    let marker;
    if (withMarker) {
        marker = new Marker({
            svg: svgContainer,
            id: uniqueMarkerId(),
            size: markerSize,
            fillColor: markerColor ?? strokeColor,
        });
    }

    const line = new Line({
        svg: svgContainer,
        marker,
        label,
        strokeColor,
        curviness,
        scale,
        className,
        offset,
        onClick,
        onHover,
    });

    return { line, label };
};
