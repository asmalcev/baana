import { SVGContainer } from '.';
import { Label, LabelInterface } from './Label';
import { Line, LinePropsType } from './Line';
import { Marker } from './Marker';
import { uniqueMarkerId } from './utils';

export type LineFactoryProps = {
    svg: SVGContainer;

    scale?: LinePropsType['scale'];
    offset?: LinePropsType['offset'];
    curviness?: LinePropsType['curviness'];
    className?: LinePropsType['className'];
    strokeColor?: LinePropsType['strokeColor'];
    strokeWidth?: LinePropsType['strokeWidth'];

    /**
     * EVENTS HANDLERS
     */
    onClick?: LinePropsType['onClick'];
    onHover?: LinePropsType['onHover'];

    /**
     * MARKER PROPS
     */
    withMarker?: boolean;
    markerColor?: string;
    markerSize?: number;
} & (
    | {
          /**
           * DEFAULT LABEL PROPS
           */
          labelText?: string;
          labelClassName?: string;

          customLabel?: never;
      }
    | {
          /**
           * CUSTOM LABEL PROPS
           */
          customLabel?: LabelInterface;

          labelText?: never;
          labelClassName?: never;
      }
);

export const LineFactory = ({
    svg,

    scale,
    offset,
    curviness,
    className,
    strokeColor = 'black',
    strokeWidth = 1,

    /**
     * EVENTS HANDLERS
     */
    onClick,
    onHover,

    /**
     * LABEL PROPS
     */
    labelText,
    labelClassName,
    customLabel,

    /**
     * MARKER PROPS
     */
    withMarker,
    markerColor,
    markerSize,
}: LineFactoryProps) => {
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
        label,
        scale,
        marker,
        offset,
        curviness,
        className,
        strokeColor,
        strokeWidth,
        onClick,
        onHover,
    });

    return { line, label, marker };
};
