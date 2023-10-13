import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { PointObj } from '../utils';
import { Marker } from '..';
import { LinePropsType } from '../Line';
import { MarkerPropsType } from '../Marker';
import { LabelPropsType } from '../Label';

export type LineContextType = {
    register(callback: () => void): void;
    update(start: PointObj, end: PointObj): void;

    getContainer(): HTMLDivElement | null;
    getMarker(): Marker | null;
    getConfig(): {
        color?: string;
        labelClassName?: string;
    }
};

const defaultValue = {
    register: () => {},
    update: () => {},
    getContainer: () => null,
    getMarker: () => null,
    getConfig: () => ({})
};

export const LineContext = createContext<LineContextType>(defaultValue);

type LineContextProviderType = {
    children: ReactNode;
};

export const LineContextProvider: React.FC<
    LineContextProviderType & {
        color: LinePropsType['strokeColor'];

        headColor: MarkerPropsType['fillColor'];
        headSize: MarkerPropsType['size'];

        labelClassName: LabelPropsType['className'];
    } 
> = ({ children, color, headColor, headSize, labelClassName }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const subscribers = useRef<(() => void)[]>([]);

    const [marker, setMarker] = useState<Marker | null>(null);

    const register: LineContextType['register'] = (callback) => {
        subscribers.current.push(callback);
        callback();
    };

    const update: LineContextType['update'] = () => {
        subscribers.current.forEach((callback) => callback());
    };

    useEffect(() => {
        if (
            containerRef.current &&
            marker?.container !== containerRef.current
        ) {
            marker?.container.removeChild(marker?.svg);
            setMarker(
                new Marker({
                    container: containerRef.current,
                    fillColor: headColor || color,
                    size: headSize,
                })
            );
        }
    }, [containerRef.current]);

    const getContainer = () => containerRef.current;
    const getMarker = () => marker;
    const getConfig = () => ({
        color,
        labelClassName,
    });

    return (
        <LineContext.Provider
            value={{
                register,
                update,
                getContainer,
                getMarker,
                getConfig,
            }}
        >
            <div ref={containerRef}>{children}</div>
        </LineContext.Provider>
    );
};

export const useLineContext = () => useContext(LineContext);
