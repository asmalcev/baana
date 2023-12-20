import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Line, LineFactory, useLineContext, ReactLabel, Marker } from '..';
import { PointObj, uniqueMarkerId } from '../utils';
import { LabelInterface, LabelPropsType } from '../Label';
import { LinePropsType } from '../Line';
import { createPortal } from 'react-dom';
import { ConfigType, OffsetXY } from './LineContext';
import { LineFactoryProps } from '../LineFactory';

export type Render = (start: PointObj, end: PointObj) => void;

export type TargetPointer = React.RefObject<HTMLElement> | string;

type ArrowProps = {
    start: TargetPointer;
    end: TargetPointer;

    className?: ConfigType['arrowClassName'];
} & (
    | {
          /**
           * CUSTON LABEL
           */
          label?: JSX.Element;

          text?: never;
          labelClassName?: never;
      }
    | {
          /**
           * DEFAULT LABEL
           */
          text?: LabelPropsType['text'];
          labelClassName?: LabelPropsType['className'];

          label?: never;
      }
) &
    Pick<
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
    OffsetXY &
    Pick<LineFactoryProps, 'onClick' | 'onHover'>;

export const Arrow: React.FC<ArrowProps> = ({
    start,
    end,

    color,
    scale,
    curviness,
    className,
    strokeWidth,

    onlyIntegerCoords,
    useRegister,

    offsetStartX,
    offsetStartY,
    offsetEndX,
    offsetEndY,

    text,
    labelClassName,
    label: customLabel,

    withHead,
    headColor,
    headSize,

    onHover,
    onClick,
}) => {
    const {
        _getContainerRef,
        _getSVG,
        _getConfig,
        _registerTarget,
        _removeTarget,
        _unstableState,
    } = useLineContext();

    const cached = useRef<{
        line?: Line;
        marker?: Marker;
        label?: LabelInterface;
    }>({});

    const container = _getContainerRef();
    const svg = _getSVG();
    const config = _getConfig();

    const offset = useMemo<LinePropsType['offset']>(
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

    const customLabelController = customLabel && ReactLabel(customLabel);

    const withMarker =
        withHead ??
        config.withHead ??
        Boolean(headColor || headSize || config.headColor || config.headSize);

    const updateLine = useCallback(() => {
        const startElement =
            typeof start === 'string'
                ? document.getElementById(start)
                : start.current;
        const endElement =
            typeof end === 'string'
                ? document.getElementById(end)
                : end.current;

        if (cached.current.line && startElement && endElement) {
            cached.current.line.update(startElement, endElement);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]);

    const clearHTMLNodes = () => {
        cached.current.line?.remove();
        cached.current.label?.remove?.();
        cached.current.marker?.remove();
    };

    /**
     * RECREATE IF CONTAINER CHANGES
     */
    useEffect(() => {
        const arrow = cached.current.line;

        if (container && svg && arrow?.svg !== svg.svg) {
            arrow?.remove();

            const {
                line,
                label: simpleLabel,
                marker,
            } = LineFactory({
                svg,

                scale: scale ?? config.scale,
                offset,
                strokeColor: color ?? config.color,
                curviness: curviness ?? config.curviness,
                className: className ?? config.arrowClassName,
                strokeWidth: strokeWidth ?? config.strokeWidth,

                onlyIntegerCoords:
                    onlyIntegerCoords ?? config.onlyIntegerCoords,

                withMarker,
                markerColor: headColor ?? config.headColor,
                markerSize: headSize ?? config.headSize,

                onHover,
                onClick,

                ...(customLabelController?.controller
                    ? {
                          customLabel: customLabelController?.controller,
                      }
                    : {
                          labelText: text,
                          labelClassName:
                              labelClassName ?? config.labelClassName,
                      }),
            });

            cached.current = {
                line,
                marker,
                label: simpleLabel,
            };

            updateLine();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container?.current]);

    /**
     * REMOVE HTML NODES ON UNMOUNT
     */
    useEffect(() => {
        return clearHTMLNodes;
    }, []);

    /**
     * LINE EFFECTS
     */
    useEffect(() => {
        if (cached.current.line && offset) {
            cached.current.line.configOffset(offset);
        }
    }, [offset]);

    useEffect(() => {
        if (cached.current.line) {
            cached.current.line.configScale(scale ?? config.scale);
        }
    }, [config.scale, scale]);

    useEffect(() => {
        const _color = color ?? config.color;
        if (cached.current.line && _color) {
            cached.current.line.configStrokeColor(_color);
        }
    }, [color, config.color]);

    useEffect(() => {
        const _strokeWidth = strokeWidth ?? config.strokeWidth;
        if (cached.current.line && _strokeWidth) {
            cached.current.line.configStrokeWidth(_strokeWidth);
        }
    }, [config.strokeWidth, strokeWidth]);

    useEffect(() => {
        if (cached.current.line) {
            cached.current.line.configCurviness(curviness ?? config.curviness);
        }
    }, [config.curviness, curviness]);

    useEffect(() => {
        if (cached.current.line) {
            cached.current.line.configClassName(
                className ?? config.arrowClassName
            );
        }
    }, [className, config.arrowClassName]);

    useEffect(() => {
        if (cached.current.line) {
            cached.current.line.configOnClick(onClick);
        }
    }, [onClick]);

    useEffect(() => {
        if (cached.current.line) {
            cached.current.line.configOnHover(onHover);
        }
    }, [onHover]);

    /**
     * RECREATE MARKER IF WITH_MARKER CHANGES
     */
    useEffect(() => {
        if (!withMarker) {
            cached.current.marker?.remove();
            cached.current.marker = undefined;
        } else if (!cached.current.marker && svg?.svg) {
            cached.current.marker = new Marker({
                svg: svg?.svg,
                id: uniqueMarkerId(),
                size: headSize ?? config.headSize,
                fillColor:
                    headColor ?? config.headColor ?? color ?? config.color,
            });

            cached.current.line?.configMarker(cached.current.marker);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withMarker]);

    /**
     * CHANGE MARKER SIZE AND COLOR ON CHANGING
     */
    useEffect(() => {
        if (cached.current.marker) {
            cached.current.marker.setSize(headSize ?? config.headSize);
            cached.current.marker.setFillColor(
                headColor ?? config.headColor ?? color ?? config.color
            );
        }
    }, [
        color,
        config.color,
        config.headColor,
        config.headSize,
        headColor,
        headSize,
    ]);

    /**
     * CHANGE LABEL CLASSNAME ON LABEL_CLASSNAME CHANGING
     */
    useEffect(() => {
        if (cached.current.label) {
            cached.current.label?.configClassName?.(
                labelClassName ?? config.labelClassName
            );
        }
    }, [config.labelClassName, labelClassName]);

    /**
     * CHANGE LABEL TEXT ON LABEL_TEXT CHANGING
     */
    useEffect(() => {
        if (cached.current.label && text) {
            cached.current.label.setText?.(text);
        }
    }, [text]);

    /**
     * OPTIMIZATION
     */
    useEffect(() => {
        if (cached.current.line) {
            cached.current.line.configOnlyIntegerCoords(
                onlyIntegerCoords ?? config.onlyIntegerCoords
            );
        }
    }, [onlyIntegerCoords, config.onlyIntegerCoords]);

    const shouldRegister = useRegister ?? config.useRegister;

    /**
     * RERENDER IF START/END CHANGES
     */
    useEffect(() => {
        if (shouldRegister) {
            _removeTarget(start, updateLine);
            _removeTarget(end, updateLine);

            _registerTarget(start, updateLine);
            _registerTarget(end, updateLine);
        }

        updateLine();
    }, [
        updateLine,
        start,
        end,
        _removeTarget,
        _registerTarget,
        shouldRegister,
    ]);

    useEffect(() => {
        updateLine();
    }, [_unstableState, updateLine]);

    return container?.current && customLabelController?.render
        ? createPortal(customLabelController?.render(), container?.current)
        : null;
};
