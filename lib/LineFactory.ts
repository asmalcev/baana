import { Label } from './Label';
import { Line, WithSetPos } from './Line';
import { Marker } from './Marker';

export const LineFactory = ({
    container,

    labelText,
    labelClassName,
    customLabel,

    strokeColor = 'black',

    marker,
}: {
    container: HTMLElement;

    labelText?: string;
    labelClassName?: string;
    customLabel?: WithSetPos;

    strokeColor?: string;

    marker?: Marker;
    markerColor?: string;
    markerSize?: number;
}) => {
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

    // if (markerColor) {
    //     marker?.setFillColor(markerColor);
    // } else {
    //     marker?.setFillColor(strokeColor);
    // }

    // if (markerSize) {
    //     marker?.setSize(markerSize);
    // }

    const line = new Line({
        container,
        marker,
        label,
        strokeColor,
    });

    return { line, label };
};
