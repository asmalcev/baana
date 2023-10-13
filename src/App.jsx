import { useRef } from 'react';
import Draggable from 'react-draggable';

import { LineContextProvider, useLineContext, Arrow, ReactLabel } from '../lib';

const Diagram = () => {
    const { update } = useLineContext();

    const block1 = useRef(null);
    const block2 = useRef(null);
    const block3 = useRef(null);
    const block4 = useRef(null);
    const block5 = useRef(null);
    const block6 = useRef(null);

    const clickHandler = () => {
        console.log('CLICK!');
    }

    return (
        <>
            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 50, y: 300 }}
            >
                <div id="block1" className="block" ref={block1} />
            </Draggable>
            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 250, y: 500 }}
            >
                <div id="block2" className="block" ref={block2} />
            </Draggable>

            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 250, y: 150 }}
            >
                <div id="block3" className="block" ref={block3} />
            </Draggable>
            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 450, y: 50 }}
            >
                <div id="block4" className="block" ref={block4} />
            </Draggable>
            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 450, y: 250 }}
            >
                <div id="block5" className="block" ref={block5} />
            </Draggable>
            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 450, y: 400 }}
            >
                <div id="block6" className="block" ref={block6} />
            </Draggable>

            <Arrow startRef={block1} endRef={block2} color="pink" />
            <Arrow startRef={block3} endRef={block4} text="LaBeL" />
            <Arrow
                startRef={block1}
                endRef={block3}
                color="#333"
                text="label text"
            />
            <Arrow startRef={block3} endRef={block5} />
            <Arrow
                startRef={block5}
                endRef={block6}
                label={ReactLabel(
                    <div className="label custom-label">
                        <p>hello world</p>
                        <button onClick={clickHandler}>Click!</button>
                    </div>
                )}
            />
            <Arrow startRef={block6} endRef={block2} color="green" />
        </>
    );
};

export const App = () => (
    <LineContextProvider
        color="red"
        headColor="blue"
        headSize={16}
        labelClassName="label"
    >
        <Diagram />
    </LineContextProvider>
);
