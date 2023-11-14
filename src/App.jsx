import { useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { LineContextProvider, useLineContext, Arrow } from '../lib';

const Diagram = () => {
    const { update } = useLineContext();

    const [showArrows, setShowArrows] = useState(true);

    const [toggle, setToggle] = useState(true);

    const [color, setColor] = useState('green');
    const [text, setText] = useState('label1');
    const [labelClassName, setLabelClassName] = useState('');
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
        // setLabelClassName(toggle ? 'red-label' : ''); // ✅
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

            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 250, y: 800 }}
            >
                <div id="block7" className="block" />
            </Draggable>
            <Draggable
                onDrag={update}
                onStop={update}
                defaultPosition={{ x: 450, y: 650 }}
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
                        text={text}
                        labelClassName={labelClassName}
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
                        text={text}
                    />
                    <Arrow
                        start={blockId}
                        end="block8"
                    />
                </>
            )}

            <button onClick={toggleArrows}>
                toggleArrows
            </button>
        </>
    );
};

export const App = () => {
    const [show, setShow] = useState(true);

    const [toggle, setToggle] = useState(true);

    const [color, setColor] = useState('green');
    const [labelClassName, setLabelClassName] = useState('');
    const [curviness, setCurviness] = useState(1);
    const [offset, setOffset] = useState(0);
    const [className, setClassName] = useState('');
    const [withHead, setWithHead] = useState(true);
    const [headSize, setHeadSize] = useState(30);
    const [headColor, setHeadColor] = useState('dodgerblue');

    const clickHandler = () => {
        setToggle(!toggle);

        // setShow(!show);

        // setColor(toggle ? 'red' : 'green'); // ✅
        // setLabelClassName(toggle ? 'label' : ''); // ✅
        // setClassName(toggle ? 'custom-line-2' : ''); // ✅
        // setOffset(toggle ? 10 : 0); // ✅
        setHeadSize(toggle ? 16 : 30); // ✅
        // setHeadColor(toggle ? 'deeppink' : 'dodgerblue'); // ✅
        // setWithHead(!withHead); // ✅

        // setCurviness(toggle ? 2 : 1); // ❌
    };

    return (
        <>
            {/* <button onClick={clickHandler}>
                toggle
            </button> */}
            {show && (
                <LineContextProvider
                    color={color}
                    labelClassName={labelClassName}
                    offsetStartX={offset}
                    offsetEndX={-offset}
                    curviness={curviness}
                    arrowClassName={className}
                    withHead={withHead}
                    headColor={headColor}
                    headSize={headSize}
                >
                    <Diagram />
                </LineContextProvider>
            )}
        </>
    );
};
