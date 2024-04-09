import React from 'react';

export type MarkerPropsType = {
    id?: string;
    size?: number;
    color?: string;
};

const _defaultSize: number = 12;

export const DefaultMarker: React.FC<MarkerPropsType> = ({
    id = 'arrow-head',
    size = _defaultSize,
    color,
}) => {
    const scale = size / _defaultSize;
    return (
        <marker
            id={id}
            orient="auto"
            fill={color}
            markerWidth={12 * scale}
            markerHeight={10 * scale}
            refX={11 * scale}
            refY={5 * scale}
        >
            <path d={`M0,0 V${10 * scale} L${12 * scale},${5 * scale} Z`} />
        </marker>
    );
};
