import React, { useMemo } from 'react';
import { Arrow, ArrowProps } from './Arrow';
import { ConfigType, useLineContext } from './LineContext';

export const ArrowWrapper: React.FC<ArrowProps> = (props) => {
    const { _config, ...context } = useLineContext();

    const withHead =
        props.withHead ??
        _config.withHead ??
        Boolean(
            props.headColor ||
                props.headSize ||
                _config.headColor ||
                _config.headSize
        );

    const color = props.color ?? _config.color ?? 'black';
    const className = props.className ?? _config.arrowClassName ?? '';
    const curviness = props.curviness ?? _config.curviness ?? 1;
    const strokeWidth = props.strokeWidth ?? _config.strokeWidth ?? 1;
    const scale = props.scale ?? _config.scale ?? 1;
    const onlyIntegerCoords =
        props.onlyIntegerCoords ?? _config.onlyIntegerCoords ?? true;

    const offset = useMemo<ConfigType['offset']>(
        () => ({
            start: [
                props.offsetStartX ?? _config.offset?.start?.[0] ?? 0,
                props.offsetStartY ?? _config.offset?.start?.[1] ?? 0,
            ],
            end: [
                props.offsetEndX ?? _config.offset?.end?.[0] ?? 0,
                props.offsetEndY ?? _config.offset?.end?.[1] ?? 0,
            ],
        }),
        [
            _config.offset?.end,
            _config.offset?.start,
            props.offsetEndX,
            props.offsetEndY,
            props.offsetStartX,
            props.offsetStartY,
        ]
    );

    return (
        <Arrow
            {...props}
            {...context}
            offset={offset}
            withHead={withHead}
            color={color}
            className={className}
            curviness={curviness}
            strokeWidth={strokeWidth}
            scale={scale}
            onlyIntegerCoords={onlyIntegerCoords}
        />
    );
};
