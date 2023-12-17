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
import { SVGContainer } from '../SVG';
import { LinePropsType } from '../Line';
import { MarkerPropsType } from '../Marker';
import { LabelPropsType } from '../Label';
import { LineFactoryProps } from '../LineFactory';
import { TargetPointer } from './Arrow';

export type ConfigType = {
    /**
     * LINE PROPS
     */
    scale?: LinePropsType['scale'];
    offset?: LinePropsType['offset'];
    color?: LinePropsType['strokeColor'];
    curviness?: LinePropsType['curviness'];
    arrowClassName?: LinePropsType['className'];
    strokeWidth?: LinePropsType['strokeWidth'];

    onlyIntegers?: LinePropsType['onlyIntegers'];
    useRegister?: boolean;

    /**
     * MARKER PROPS
     */
    withHead?: LineFactoryProps['withMarker'];
    headColor?: MarkerPropsType['fillColor'];
    headSize?: MarkerPropsType['size'];

    /**
     * LABEL PROPS
     */
    labelClassName?: LabelPropsType['className'];
};

export type LineContextType = {
    update(): void;
    updateOnly(target: HTMLElement): void;

    registerTarget(target: TargetPointer, handler: () => void): void;
    removeTarget(target: TargetPointer, handler: () => void): void;

    getContainerRef(): React.RefObject<HTMLElement> | null;
    getSVG(): SVGContainer | null;
    getConfig(): ConfigType;
};

const defaultValue = {
    update: () => {},
    updateOnly: () => {},
    registerTarget: () => {},
    removeTarget: () => {},
    getContainerRef: () => null,
    getSVG: () => null,
    getConfig: () => ({}),
};

export const LineContext = createContext<LineContextType>(defaultValue);

type LineContextProviderType = {
    children: ReactNode;

    offsetStartX?: number;
    offsetStartY?: number;
    offsetEndX?: number;
    offsetEndY?: number;
} & Record<string, unknown>;

export const LineContextProvider: React.FC<
    LineContextProviderType & Omit<ConfigType, 'offset'>
> = ({
    children,

    color,
    scale,
    curviness,
    arrowClassName,
    strokeWidth,

    onlyIntegers,
    useRegister,

    offsetStartX,
    offsetStartY,
    offsetEndX,
    offsetEndY,

    withHead,
    headColor,
    headSize,

    labelClassName,

    ...others
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [svg, setSVG] = useState<SVGContainer | null>(null);

    const offset = useMemo<LinePropsType['offset']>(
        () => ({
            start: [offsetStartX ?? 0, offsetStartY ?? 0],
            end: [offsetEndX ?? 0, offsetEndY ?? 0],
        }),
        [offsetStartX, offsetStartY, offsetEndX, offsetEndY]
    );

    const [, updateState] = useState<unknown>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const update: LineContextType['update'] = () => {
        forceUpdate();
    };

    const targetsWeakMap = useRef(new WeakMap<HTMLElement, Set<() => void>>());

    const registerTarget: LineContextType['registerTarget'] = (
        target,
        handler
    ) => {
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
    };

    const removeTarget: LineContextType['removeTarget'] = (target, handler) => {
        const targetElement =
            typeof target === 'string'
                ? document.getElementById(target)
                : target.current;

        if (targetElement) {
            targetsWeakMap.current.get(targetElement)?.delete(handler);
        }
    };

    const updateOnly: LineContextType['updateOnly'] = (target) => {
        targetsWeakMap.current.get(target)?.forEach((handler) => handler());
    };

    useEffect(() => {
        if (containerRef.current && svg?.container !== containerRef.current) {
            svg?.container.removeChild(svg?.svg);
            setSVG(new SVGContainer({ container: containerRef.current }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef.current]);

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
            labelClassName,
            onlyIntegers,
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
            labelClassName,
            onlyIntegers,
            useRegister,
        ]
    );

    const getContainerRef = () => containerRef;
    const getSVG = () => svg;
    const getConfig = () => config;

    return (
        <LineContext.Provider
            value={{
                update,
                updateOnly,
                registerTarget,
                removeTarget,
                getContainerRef,
                getConfig,
                getSVG,
            }}
        >
            <div ref={containerRef} {...others}>
                {children}
            </div>
        </LineContext.Provider>
    );
};

export const useLineContext = () => useContext(LineContext);
