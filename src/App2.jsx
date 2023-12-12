import { useCallback, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import { LineContextProvider, useLineContext, Arrow, useReducedGraphics } from '../lib';

const seed = 745627567231241;
Math.seedrandom(seed);

const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const columns = 8;
const rows = 14;

const width = 100;
const height = 50;

const xdiff = width * 1.5;
const ydiff = height * 1.5;

const Diagram = ({ scale, reduceSVG }) => {
    const { update } = useLineContext();
    const handleUpdate = (mouseEvent, dragEvent) => {
        mouseEvent.stopPropagation();
        update();
        reduceSVG();
    };

    const [blocks, setBlocks] = useState([]);
    const [arrows, setArrows] = useState([]);

    useEffect(() => {
        const bls = [];
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

        const ars = [];
        for (let i = 0; i < 200; i++) {
            const start = `block${getRandomInt(0, c)}`;
            const end = `block${getRandomInt(0, c)}`;

            ars.push(
                <Arrow
                    key={start + end + Math.random()}
                    start={start}
                    end={end}
                />
            );
        }

        setBlocks(bls);
        setArrows(ars);
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

    const onMouseWheel = (e) => {
        let scrollDelta = -e.deltaY;
        setScale(scale + scrollDelta / 500);
        reduceSVG();
    };

    const { reducedClassName, reduceSVG } = useReducedGraphics();

    const handleDrag = () => {
        reduceSVG();
    };

    return (
        <>
            <Draggable
                onDrag={handleDrag}
                onStart={handleDrag}
                onStop={handleDrag}
                scale={scale}
            >
                <LineContextProvider
                    className="dragContainer"
                    color="black"
                    labelClassName="label"
                    arrowClassName={reducedClassName}
                    headSize={12}
                    scale={scale}
                    style={{
                        scale: String(scale),
                    }}
                    onlyIntegers={true}
                    onWheel={onMouseWheel}
                >
                    <Diagram scale={scale} reduceSVG={reduceSVG} />
                </LineContextProvider>
            </Draggable>
        </>
    );
};
