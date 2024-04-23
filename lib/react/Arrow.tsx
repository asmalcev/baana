import {
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Point,
    PointObj,
    comparePointObjects,
    computeHoverStrokeWidth,
    getSVGProps,
    reversePath,
    uniqueMarkerId,
    update,
} from '../utils';
import { createPortal } from 'react-dom';
import { ConfigType, LineContextType, OffsetXY } from './LineContext';
import { DefaultMarker, MarkerPropsType } from './Marker';
import React from 'react';

export type TargetPointer = React.RefObject<HTMLElement> | string;

export type ArrowProps = {
    start: TargetPointer;
    end: TargetPointer;

    className?: ConfigType['arrowClassName'];
    onClick?: MouseEventHandler;
    onHover?: MouseEventHandler;
    label?: JSX.Element;

    Marker?: React.FC<MarkerPropsType>;
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

export const Arrow: React.FC<
    Omit<
        ArrowProps,
        'offsetStartX' | 'offsetEndX' | 'offsetStartY' | 'offsetStartY'
    > &
        Omit<LineContextType, 'update' | '_config'> &
        Pick<ConfigType, 'offset'>
> = React.memo(
    ({
        start,
        end,

        color,
        scale,
        curviness,
        className,
        strokeWidth,

        useRegister,
        onlyIntegerCoords,

        offset,

        label,
        Marker = DefaultMarker,

        withHead,
        headColor,
        headSize,

        onHover,
        onClick,

        _svg,
        _defs,
        _container,
        _unstableState,
        _registerTarget,
        _removeTarget,
    }) => {
        console.info('%c TODO', 'color: red', 'rerender');
        const markerId = useRef(uniqueMarkerId());

        const hoverStrokeWidth = strokeWidth
            ? computeHoverStrokeWidth(strokeWidth, scale)
            : undefined;

        const shouldCreateHoverPath =
            hoverStrokeWidth &&
            hoverStrokeWidth > 0 &&
            Boolean(onHover || onClick);

        const lastXY = useRef([] as PointObj[]);
        const [svgProps, setSVGProps] = useState<{
            center?: Point;
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

            if (!_container || !startElement || !endElement || !offset) return;

            const [startXY, endXY] = update(
                startElement,
                endElement,
                _container,
                offset,
                scale,
                onlyIntegerCoords
            );

            if (
                lastXY.current?.length &&
                comparePointObjects(startXY, lastXY.current[0]) &&
                comparePointObjects(endXY, lastXY.current[1])
            ) {
                return;
            }

            lastXY.current = [startXY, endXY];

            const svgProps = getSVGProps(startXY, endXY, curviness);

            if (onlyIntegerCoords) {
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
            _container,
            curviness,
            shouldCreateHoverPath,
            _unstableState,
            unstableLocalState,
        ]);

        useEffect(() => {
            if (useRegister) {
                _removeTarget(start, forceUpdate);
                _removeTarget(end, forceUpdate);

                _registerTarget(start, forceUpdate);
                _registerTarget(end, forceUpdate);
            }
            return () => {
                _removeTarget(start, forceUpdate);
                _removeTarget(end, forceUpdate);
            };
        }, [
            start,
            end,
            _removeTarget,
            _registerTarget,
            useRegister,
            forceUpdate,
        ]);

        return (
            <>
                {_defs
                    ? createPortal(
                          <>
                              {withHead && (
                                  <Marker
                                      id={markerId.current}
                                      color={headColor ?? color}
                                      size={headSize}
                                  />
                              )}
                          </>,
                          _defs
                      )
                    : null}
                {_svg
                    ? createPortal(
                          <>
                              <path
                                  d={svgProps?.d ?? ''}
                                  className={className}
                                  stroke={color}
                                  strokeWidth={strokeWidth}
                                  fill="none"
                                  markerEnd={
                                      withHead ? `url(#${markerId.current}` : ''
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
                          _svg
                      )
                    : null}
                {_container && svgProps.d
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
                          _container
                      )
                    : null}
            </>
        );
    },
    (prevProps, nextProps) => {
        const changes = Object.entries(nextProps)
            .filter(([key]) => !['children'].includes(key))
            .map(([key, value]) => [key, value === prevProps[key]]);
        const changedKeys = new Set(
            changes.filter((row) => !row[1]).map((row) => row[0])
        );
        if (changedKeys.size === 1 && changedKeys.has('scale')) {
            return true;
        }
        return false;
    }
);
