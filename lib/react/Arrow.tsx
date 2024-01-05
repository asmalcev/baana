import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useLineContext } from '..';
import {
    PointObj,
    comparePointObjects,
    computeHoverStrokeWidth,
    getSVGProps,
    reversePath,
    uniqueMarkerId,
    update,
} from '../utils';
import { createPortal } from 'react-dom';
import { ConfigType, OffsetXY } from './LineContext';
import { Marker } from './Marker';
import React from 'react';

export type Render = (start: PointObj, end: PointObj) => void;

export type TargetPointer = React.RefObject<HTMLElement> | string;

type ArrowProps = {
    start: TargetPointer;
    end: TargetPointer;

    className?: ConfigType['arrowClassName'];
    onClick: MouseEventHandler;
    onHover: MouseEventHandler;
    label?: JSX.Element;
} & Pick<
    ConfigType,
    | 'scale'
    | 'color'
    | 'curviness'
    | 'strokeWidth'
    | 'onlyIntegerCoords'
    | 'useRegister'
    | 'withHead'
    | 'headSize'
    | 'headColor'
> &
    OffsetXY;

export const Arrow: React.FC<ArrowProps> = ({
    start,
    end,

    color,
    scale,
    curviness,
    className,
    strokeWidth,

    useRegister,
    onlyIntegerCoords,

    offsetStartX,
    offsetStartY,
    offsetEndX,
    offsetEndY,

    label,

    withHead,
    headColor,
    headSize,

    onHover,
    onClick,
}) => {
    const {
        _getSVG,
        _getDefs,
        _getConfig,
        _getContainerRef,
        _unstableState,
        _registerTarget,
        _removeTarget,
    } = useLineContext();

    const markerId = useRef(uniqueMarkerId());

    const svg = _getSVG();
    const defs = _getDefs();
    const config = _getConfig();
    const container = _getContainerRef();

    const withMarker =
        withHead ??
        config.withHead ??
        Boolean(headColor || headSize || config.headColor || config.headSize);

    const _color = color ?? config.color ?? 'black';
    const _className = className ?? config.arrowClassName ?? '';
    const _curviness = curviness ?? config.curviness ?? 1;
    const _strokeWidth = strokeWidth ?? config.strokeWidth ?? 1;
    const _scale = scale ?? config.scale ?? 1;
    const _onlyIntegerCoords =
        onlyIntegerCoords ?? config.onlyIntegerCoords ?? true;

    const offset = useMemo<ConfigType['offset']>(
        () => ({
            start: [
                offsetStartX ?? config.offset?.start?.[0] ?? 0,
                offsetStartY ?? config.offset?.start?.[1] ?? 0,
            ],
            end: [
                offsetEndX ?? config.offset?.end?.[0] ?? 0,
                offsetEndY ?? config.offset?.end?.[1] ?? 0,
            ],
        }),
        [offsetStartX, offsetStartY, offsetEndX, offsetEndY, config.offset]
    );

    const hoverStrokeWidth = _strokeWidth
        ? computeHoverStrokeWidth(_strokeWidth, _scale)
        : undefined;

    const shouldCreateHoverPath =
        hoverStrokeWidth && hoverStrokeWidth > 0 && Boolean(onHover || onClick);

    const lastXY = useRef([] as PointObj[]);
    const [svgProps, setSVGProps] = useState<{
        center?: [number, number];
        d?: string;
        reversed?: string;
    }>({});

    const [unstableLocalState, updateState] = useState<unknown>();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        const startElement =
            typeof start === 'string'
                ? document.getElementById(start)
                : start.current;
        const endElement =
            typeof end === 'string'
                ? document.getElementById(end)
                : end.current;

        if (!container || !startElement || !endElement || !offset) return;

        const [startXY, endXY] = update(
            startElement,
            endElement,
            container,
            offset,
            _scale,
            _onlyIntegerCoords
        );

        if (
            lastXY.current &&
            comparePointObjects(startXY, lastXY.current[0]) &&
            comparePointObjects(endXY, lastXY.current[1])
        ) {
            return;
        }

        lastXY.current = [startXY, endXY];

        const svgProps = getSVGProps(startXY, endXY, _curviness);

        if (_onlyIntegerCoords) {
            svgProps.d = svgProps.d.map((e) =>
                typeof e === 'number' ? Math.floor(e) : e
            );
        }

        const d = svgProps.d.join(' ');

        setSVGProps({
            center: svgProps.center,
            d,
            reversed: shouldCreateHoverPath
                ? d + reversePath(svgProps.d).join(' ')
                : '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        start,
        end,
        offset,
        container,
        _curviness,
        shouldCreateHoverPath,
        _unstableState,
        unstableLocalState,
    ]);

    const shouldRegister = useRegister ?? config.useRegister;

    useEffect(() => {
        if (shouldRegister) {
            _removeTarget(start, forceUpdate);
            _removeTarget(end, forceUpdate);

            _registerTarget(start, forceUpdate);
            _registerTarget(end, forceUpdate);
        }
    }, [
        start,
        end,
        _removeTarget,
        _registerTarget,
        shouldRegister,
        forceUpdate,
    ]);

    return (
        <>
            {defs
                ? createPortal(
                      <>
                          {withMarker && (
                              <Marker
                                  id={markerId.current}
                                  fillColor={headColor ?? _color}
                                  size={headSize}
                              />
                          )}
                      </>,
                      defs
                  )
                : null}
            {svg
                ? createPortal(
                      <>
                          <path
                              d={svgProps?.d ?? ''}
                              className={_className}
                              stroke={_color}
                              strokeWidth={_strokeWidth}
                              fill="none"
                              markerEnd={
                                  withMarker ? `url(#${markerId.current}` : ''
                              }
                          />
                          {shouldCreateHoverPath && (
                              <path
                                  d={svgProps?.d ?? ''}
                                  stroke="none"
                                  fill="none"
                                  className="baana__interactive-path"
                                  strokeWidth={hoverStrokeWidth}
                                  onMouseOver={onHover}
                                  onClick={onClick}
                              />
                          )}
                      </>,
                      svg
                  )
                : null}
            {container && svgProps.d
                ? createPortal(
                      <div
                          className="baana__line-label"
                          style={{
                              top: svgProps?.center?.[1],
                              left: svgProps?.center?.[0],
                          }}
                      >
                          {label}
                      </div>,
                      container
                  )
                : null}
        </>
    );
};
