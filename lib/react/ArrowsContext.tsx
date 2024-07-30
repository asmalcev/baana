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
};

export type OffsetXY = {
    offsetStartX?: number;
    offsetStartY?: number;
    offsetEndX?: number;
    offsetEndY?: number;
};

export type ArrowsContextType = {
    update(target?: HTMLElement): void;

    _registerTarget(target: TargetPointer, handler: () => void): void;
    _removeTarget(target: TargetPointer, handler: () => void): void;

    _container: HTMLElement | null;
    _svg: SVGSVGElement | null;
    _defs: SVGDefsElement | null;
    _config: ConfigType;

    _unstableState: unknown;

    _containerRef: React.RefObject<HTMLDivElement>;
    _svgRef: React.RefObject<SVGSVGElement>;
    _defsRef: React.RefObject<SVGDefsElement>;
};

const defaultValue = {
    update: () => {},
    _registerTarget: () => {},
    _removeTarget: () => {},
    _container: null,
    _svg: null,
    _defs: null,
    _config: {},
    _unstableState: null,
    _containerRef: { current: null },
    _svgRef: { current: null },
    _defsRef: { current: null },
};

export const ArrowsContext = createContext<ArrowsContextType>(defaultValue);

export const ArrowsContextProvider: React.FC<
    { children: ReactNode } & Omit<ConfigType, 'offset'> & OffsetXY
> = ({
    children,

    color,
    scale,
    curviness,
    strokeWidth,

    useRegister,

    offsetStartX,
    offsetStartY,
    offsetEndX,
    offsetEndY,

    withHead,
    headColor,
    headSize,
}) => {
    const _containerRef = useRef<HTMLDivElement>(null);
    const _svgRef = useRef<SVGSVGElement>(null);
    const _defsRef = useRef<SVGDefsElement>(null);

    const [_container, setContainer] = useState<HTMLDivElement | null>(
        _containerRef.current
    );
    const [_svg, setSVG] = useState<SVGSVGElement | null>(_svgRef.current);
    const [_defs, setDefs] = useState<SVGDefsElement | null>(_defsRef.current);

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

    const _registerTarget: ArrowsContextType['_registerTarget'] = useCallback(
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

    const _removeTarget: ArrowsContextType['_removeTarget'] = useCallback(
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

    const update: ArrowsContextType['update'] = useCallback(
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

    useEffect(() => {
        setContainer(_containerRef.current);
        setSVG(_svgRef.current);
        setDefs(_defsRef.current);
    }, []);

    const contextValue = useMemo(
        () => ({
            _container,
            _svg,
            _defs,
            _containerRef,
            _svgRef,
            _defsRef,
            _config: {
                color,
                scale,
                offset,
                withHead,
                headSize,
                headColor,
                curviness,
                strokeWidth,
                useRegister,
            },
            update,
            _registerTarget,
            _removeTarget,
            _unstableState,
        }),
        [
            _container,
            _svg,
            _defs,
            color,
            scale,
            offset,
            withHead,
            headSize,
            headColor,
            curviness,
            strokeWidth,
            useRegister,
            update,
            _registerTarget,
            _removeTarget,
            _unstableState,
        ]
    );

    return (
        <ArrowsContext.Provider value={contextValue}>
            {children}
        </ArrowsContext.Provider>
    );
};

export const useArrowsContext = () => useContext(ArrowsContext);
