import { Label } from './Label';
import { Line } from './Line';
import { Marker } from './Marker';

export const LineFactory = ({
    container,

    labelText,
    customLabel,

    strokeColor,

    marker,
    markerColor,
    markerSize,
}:{
    container: HTMLElement,

    labelText: string,
    customLabel: HTMLElement,

    strokeColor: string,

    marker: Marker;
    markerColor: string,
    markerSize: number,
}) => {
    let label;
    if (!customLabel) {
        label = new Label({
            container,
            text: labelText,
        });
    } else {
        label = customLabel;
    }

    if (markerColor) {
        marker?.setFillColor(markerColor);
    } else {
        marker?.setFillColor(strokeColor);
    }

    if (markerSize) {
        marker?.setSize(markerSize);
    }

    const line = new Line({
        container,
        marker,
        label,
        strokeColor,
    });

    return { line, label };
};