import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Point } from '../utils';
import { TargetPointer } from './Arrow';

export type ConfigType = {
    color?: string;
    arrowClassName?: string;

    useRegister?: boolean;

    withHead?: boolean;
    headColor?: string;
    headSize?: number;

    scale?: number;
    offset?: {
        start: Point;
        end: Point;
    };
    curviness?: number;
    strokeWidth?: number;
    onlyIntegerCoords?: boolean;
};

export type OffsetXY = {
    offsetStartX?: number;
    offsetStartY?: number;
    offsetEndX?: number;
    offsetEndY?: number;
};

export type LineContextType = {
    update(target?: HTMLElement): void;

    _registerTarget(target: TargetPointer, handler: () => void): void;
    _removeTarget(target: TargetPointer, handler: () => void): void;

    _getContainerRef(): HTMLElement | null;
    _getSVG(): SVGSVGElement | null;
    _getDefs(): SVGDefsElement | null;
    _getConfig(): ConfigType;

    _unstableState: unknown;
};

const defaultValue = {
    update: () => {},
    _registerTarget: () => {},
    _removeTarget: () => {},
    _getContainerRef: () => null,
    _getSVG: () => null,
    _getDefs: () => null,
    _getConfig: () => ({}),
    _unstableState: null,
};

export const LineContext = createContext<LineContextType>(defaultValue);

export const LineContextProvider: React.FC<
    { children: ReactNode; className: string } & Omit<ConfigType, 'offset'> &
        OffsetXY &
        Record<string, unknown>
> = ({
    children,
    className,

    color,
    scale,
    curviness,
    arrowClassName,
    strokeWidth,

    onlyIntegerCoords,
    useRegister,

    offsetStartX,
    offsetStartY,
    offsetEndX,
    offsetEndY,

    withHead,
    headColor,
    headSize,

    ...others
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const defsRef = useRef<SVGDefsElement>(null);

    const [container, setContainer] = useState<HTMLDivElement | null>(
        containerRef.current
    );
    const [svg, setSVG] = useState<SVGSVGElement | null>(svgRef.current);
    const [defs, setDefs] = useState<SVGDefsElement | null>(defsRef.current);

    const offset = useMemo<ConfigType['offset']>(
        () => ({
            start: [offsetStartX ?? 0, offsetStartY ?? 0],
            end: [offsetEndX ?? 0, offsetEndY ?? 0],
        }),
        [offsetStartX, offsetStartY, offsetEndX, offsetEndY]
    );

    const [_unstableState, updateState] = useState<unknown>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const targetsWeakMap = useRef(new WeakMap<HTMLElement, Set<() => void>>());

    const _registerTarget: LineContextType['_registerTarget'] = useCallback(
        (target, handler) => {
            const targetElement =
                typeof target === 'string'
                    ? document.getElementById(target)
                    : target.current;

            if (targetElement) {
                if (!targetsWeakMap.current.has(targetElement)) {
                    targetsWeakMap.current.set(targetElement, new Set());
                }
                targetsWeakMap.current.get(targetElement)?.add(handler);
            }
        },
        []
    );

    const _removeTarget: LineContextType['_removeTarget'] = useCallback(
        (target, handler) => {
            const targetElement =
                typeof target === 'string'
                    ? document.getElementById(target)
                    : target.current;

            if (targetElement) {
                targetsWeakMap.current.get(targetElement)?.delete(handler);
            }
        },
        []
    );

    const update: LineContextType['update'] = useCallback(
        (target) => {
            if (target && targetsWeakMap.current.get(target)) {
                targetsWeakMap.current
                    .get(target)
                    ?.forEach((handler) => handler());
            } else {
                forceUpdate();
            }
        },
        [forceUpdate]
    );

    const config = useMemo(
        () => ({
            color,
            scale,
            offset,
            withHead,
            headSize,
            headColor,
            curviness,
            strokeWidth,
            arrowClassName,
            onlyIntegerCoords,
            useRegister,
        }),
        [
            color,
            scale,
            offset,
            withHead,
            headSize,
            headColor,
            curviness,
            strokeWidth,
            arrowClassName,
            onlyIntegerCoords,
            useRegister,
        ]
    );

    useEffect(() => {
        setContainer(containerRef.current);
        setSVG(svgRef.current);
        setDefs(defsRef.current);
    }, []);

    const _getContainerRef = () => container;
    const _getSVG = () => svg;
    const _getDefs = () => defs;
    const _getConfig = () => config;

    return (
        <LineContext.Provider
            value={{
                update,
                _registerTarget,
                _removeTarget,
                _getContainerRef,
                _getConfig,
                _getSVG,
                _getDefs,
                _unstableState,
            }}
        >
            <div
                ref={containerRef}
                className={`${className} baana__container`}
                {...others}
            >
                <svg ref={svgRef} className="baana__svg">
                    <defs ref={defsRef}></defs>
                </svg>
                {children}
            </div>
        </LineContext.Provider>
    );
};

export const useLineContext = () => useContext(LineContext);
