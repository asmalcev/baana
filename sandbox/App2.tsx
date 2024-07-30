import React, {
    ReactNode,
    useEffect,
    useState,
    WheelEventHandler,
} from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import {
    Arrow,
    ArrowsContainer,
    ArrowsContextProvider,
    useArrowsContext,
    useReducedGraphics,
} from '../lib';

declare global {
    interface Math {
        seedrandom(seed: number): void;
    }
}

const seed = 745627567231241;
Math.seedrandom(seed);

const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min);

const columns = 8;
const rows = 14;

const width = 100;
const height = 50;

const xdiff = width * 1.5;
const ydiff = height * 1.5;

const Diagram: React.FC<{ scale: number; reduceSVG: () => void }> = ({
    scale,
    reduceSVG,
}) => {
    const { update } = useArrowsContext();

    const handleUpdate: DraggableEventHandler = (mouseEvent, dragEvent) => {
        mouseEvent.stopPropagation();
        update(dragEvent.node);
        reduceSVG && reduceSVG();
    };

    const [blocks, setBlocks] = useState<ReactNode[]>([]);
    const [arrows, setArrows] = useState<ReactNode[]>([]);

    useEffect(() => {
        const bls: ReactNode[] = [];
        let c = 0;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (Math.random() > 0.4) {
                    const key = `block${c++}`;
                    bls.push(
                        <Draggable
                            onDrag={handleUpdate}
                            onStart={handleUpdate}
                            onStop={handleUpdate}
                            defaultPosition={{
                                x: width * j + xdiff * (j + 1),
                                y: height * i + ydiff * (i + 1),
                            }}
                            scale={scale}
                            key={key + Math.random()}
                        >
                            <div id={key} className="block" />
                        </Draggable>
                    );
                }
            }
        }

        const ars: ReactNode[] = [];
        for (let i = 0; i < 2000; i++) {
            const start = `block${getRandomInt(0, c)}`;
            const end = `block${getRandomInt(0, c)}`;

            ars.push(
                <Arrow
                    key={start + end + Math.random()}
                    start={start}
                    end={end}
                    // label={<p>label</p>}
                />
            );
        }

        setBlocks(bls);
        setArrows(ars);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {blocks}
            {arrows}
        </>
    );
};

export const App = () => {
    const [scale, setScale] = useState(1);

    const { reducedClassName, reduceSVG } = useReducedGraphics();

    const onMouseWheel: WheelEventHandler = (e) => {
        setScale(scale - e.deltaY / 500);
        reduceSVG();
    };

    const handleDrag = () => {
        reduceSVG();
    };

    return (
        <>
            <ArrowsContextProvider
                color="black"
                headSize={12}
                scale={scale}
                useRegister={true}
            >
                <Draggable
                    onDrag={handleDrag}
                    onStart={handleDrag}
                    onStop={handleDrag}
                    scale={scale}
                >
                    <div
                        style={{
                            scale: String(scale),
                        }}
                        onWheel={onMouseWheel}
                    >
                        <ArrowsContainer
                            className={`dragContainer ${reducedClassName}`}
                        >
                            <Diagram scale={scale} reduceSVG={reduceSVG} />
                        </ArrowsContainer>
                    </div>
                </Draggable>
            </ArrowsContextProvider>
        </>
    );
};
