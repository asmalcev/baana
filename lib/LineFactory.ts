import { SVGContainer } from '.';
import { Label, LabelInterface } from './Label';
import { Line, LinePropsType } from './Line';
import { Marker, MarkerPropsType } from './Marker';
import { uniqueMarkerId } from './utils';

export type LineFactoryProps = {
    svg: SVGContainer;

    withMarker?: boolean;
    markerColor?: MarkerPropsType['fillColor'];
    markerSize?: MarkerPropsType['size'];
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
) &
    Pick<
        LinePropsType,
        | 'scale'
        | 'offset'
        | 'curviness'
        | 'className'
        | 'strokeColor'
        | 'strokeWidth'
        | 'onlyIntegerCoords'
        | 'onClick'
        | 'onHover'
    >;

export const LineFactory = ({
    svg,

    strokeColor = 'black',
    strokeWidth = 1,

    onlyIntegerCoords = false,

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

    ...otherProps
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
        marker,
        strokeColor,
        strokeWidth,
        onlyIntegerCoords,
        ...otherProps,
    });

    return { line, label, marker };
};
