import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { LineContextProvider, useLineContext, Arrow } from '../lib';

const Diagram = ({ scale }) => {
    const { update } = useLineContext();

    const handleUpdate = (mouseEvent, dragEvent) => {
        mouseEvent.stopPropagation();
        update();
    };

    const [showArrows, setShowArrows] = useState(true);

    const [toggle, setToggle] = useState(true);

    const [color, setColor] = useState('green');
    const [text, setText] = useState('label1');
    const [cLabel, setCLabel] = useState(<p>clabel1</p>);
    const [curviness, setCurviness] = useState(1);
    const [offset, setOffset] = useState(0);
    const [className, setClassName] = useState('');
    const [withHead, setWithHead] = useState(true);
    const [headSize, setHeadSize] = useState(10);
    const [headColor, setHeadColor] = useState('pink');
    const [blockId, setBlockId] = useState('block7');

    const hoverHandlers = {
        1: (e) => {
            console.log('hover event', e);
        },
        2: (e) => {
            console.log('another hover event', e);
        },
    };

    const block1 = useRef(null);
    const block2 = useRef(null);
    const block3 = useRef(null);
    const block4 = useRef(null);
    const block5 = useRef(null);
    const block6 = useRef(null);

    const [eRef, setERef] = useState(block2);

    const clickHandler = () => {
        setToggle(!toggle);

        // setColor(toggle ? 'black' : 'green'); // ✅
        setERef(toggle ? block1 : block2); // ✅
        // setText(toggle ? 'label2' : 'label1'); // ✅
        // setCLabel(toggle ? <b>clabel1 :/</b> : <p>clabel1</p>); // ✅
        // setHeadSize(toggle ? 20 : 10); // ✅
        // setHeadColor(toggle ? 'purple' : 'pink'); // ✅
        // setCurviness(toggle ? 2 : 1); // ✅
        // setOffset(toggle ? 20 : 0); // ✅
        // setClassName(toggle ? 'custom-line' : ''); // ✅
        // setWithHead(!withHead); // ✅
        setBlockId(toggle ? 'block2' : 'block7'); // ✅
    };

    const toggleArrows = () => {
        setShowArrows(!showArrows);
    };

    const onClick = (e) => {
        console.log('click event', e);
    };

    return (
        <>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 50, y: 300 }}
                scale={scale}
            >
                <div id="block1" className="block" ref={block1} />
            </Draggable>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 250, y: 500 }}
                scale={scale}
            >
                <div id="block2" className="block" ref={block2} />
            </Draggable>

            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 250, y: 150 }}
                scale={scale}
            >
                <div id="block3" className="block" ref={block3} />
            </Draggable>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 450, y: 50 }}
                scale={scale}
            >
                <div id="block4" className="block" ref={block4} />
            </Draggable>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 450, y: 250 }}
                scale={scale}
            >
                <div id="block5" className="block" ref={block5} />
            </Draggable>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 450, y: 400 }}
                scale={scale}
            >
                <div id="block6" className="block" ref={block6} />
            </Draggable>

            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 250, y: 800 }}
                scale={scale}
            >
                <div id="block7" className="block" />
            </Draggable>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 450, y: 650 }}
                scale={scale}
            >
                <div id="block8" className="block" />
            </Draggable>

            {showArrows && (
                <>
                    <Arrow start={block1} end={block2} color="pink" />
                    <Arrow start={block3} end={block4} label={cLabel} />
                    <Arrow
                        start={block1}
                        end={block3}
                        color="#333"
                        headColor="pink"
                    />
                    <Arrow
                        start={block3}
                        end={block5}
                        headSize={headSize}
                        withHead={withHead}
                        headColor={headColor}
                        curviness={curviness}
                        offsetStartY={offset}
                        offsetEndY={-offset}
                        className={className}
                        onHover={toggle ? hoverHandlers[2] : hoverHandlers[1]}
                        onClick={onClick}
                    />
                    <Arrow
                        start={block5}
                        end={block6}
                        label={
                            <div className="label custom-label">
                                <p>hello world</p>
                                <button onClick={clickHandler}>Action!</button>
                            </div>
                        }
                    />
                    <Arrow
                        start={block6}
                        end={eRef}
                        color={color}
                    />
                    <Arrow start={blockId} end="block8" className='redStroke greenFill'/>
                    <Arrow start="block8" end="block8"/>
                </>
            )}

            <button onClick={toggleArrows}>toggleArrows</button>
        </>
    );
};

export const App = () => {
    const [show, setShow] = useState(true);

    const [toggle, setToggle] = useState(true);

    const [color, setColor] = useState('green');
    const [curviness, setCurviness] = useState(1);
    const [offset, setOffset] = useState(0);
    const [className, setClassName] = useState('');
    const [withHead, setWithHead] = useState(true);
    const [headSize, setHeadSize] = useState(30);
    const [headColor, setHeadColor] = useState('dodgerblue');

    const [scale, setScale] = useState(1);

    const clickHandler = () => {
        setToggle(!toggle);

        // setShow(!show);

        // setColor(toggle ? 'red' : 'green'); // ✅
        // setClassName(toggle ? 'custom-line-2' : ''); // ✅
        // setOffset(toggle ? 10 : 0); // ✅
        setHeadSize(toggle ? 16 : 30); // ✅
        // setHeadColor(toggle ? 'deeppink' : 'dodgerblue'); // ✅
        // setWithHead(!withHead); // ✅

        // setCurviness(toggle ? 2 : 1); // ❌
    };

    const onMouseWheel = (e) => {
        let scrollDelta = -e.deltaY;
        setScale(scale + scrollDelta / 500);
    };

    return (
        <>
            <Draggable scale={scale}>
                <LineContextProvider
                    className={`dragContainer ${className}`}
                    color={color}
                    offsetStartX={offset}
                    offsetEndX={-offset}
                    curviness={curviness}
                    withHead={withHead}
                    headColor={headColor}
                    headSize={headSize}
                    scale={scale}
                    style={{
                        scale: String(scale),
                    }}
                    onWheel={onMouseWheel}
                >
                    <Diagram scale={scale} />
                </LineContextProvider>
            </Draggable>
        </>
    );
};
