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

    getContainerRef(): React.RefObject<HTMLElement> | null;
    getSVG(): SVGContainer | null;
    getConfig(): ConfigType;
};

const defaultValue = {
    update: () => {},
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

    useEffect(() => {
        if (containerRef.current && svg?.container !== containerRef.current) {
            svg?.container.removeChild(svg?.svg);
            setSVG(new SVGContainer({ container: containerRef.current }));
        }
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
        ]
    );

    const getContainerRef = () => containerRef;
    const getSVG = () => svg;
    const getConfig = () => config;

    return (
        <LineContext.Provider
            value={{
                update,
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
