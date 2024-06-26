import React, { useCallback, useState } from 'react';
import Draggable from 'react-draggable';

import { LineContextProvider, useLineContext, Arrow } from '../lib';

const CustomMarker = ({
    id,
    size = 12,
    color = '#000',
}) => {
    const scale = size / 12;
    return (
        <marker
            id={id}
            orient="auto"
            stroke={color}
            strokeWidth="3"
            fill="transparent"
            markerWidth={20 * scale}
            markerHeight={20 * scale}
            refX={16 * scale}
            refY={11 * scale}
        >
            <circle cx={10 * scale} cy={10 * scale} r={6 * scale}/>
        </marker>
    );
};

const Diagram = ({ scale }) => {
    const { update } = useLineContext();

    const handleUpdate = (mouseEvent, dragEvent) => {
        mouseEvent.stopPropagation();
        update(dragEvent.node);
    };

    const [showArrows, setShowArrows] = useState(true);

    const [toggle, setToggle] = useState(true);

    const [color, setColor] = useState('green');
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [curviness, setCurviness] = useState(1);
    const [offset, setOffset] = useState(0);
    const [className, setClassName] = useState('');
    const [withHead, setWithHead] = useState(true);
    const [headSize, setHeadSize] = useState(10);
    const [headColor, setHeadColor] = useState('pink');
    const [blockId, setBlockId] = useState('block1');

    const hoverHandlers = {
        1: useCallback((e) => {
            console.log('hover event', e);
        }, []),
        2: undefined,
    };

    const clickHandler = () => {
        setToggle(!toggle);

        // setColor(toggle ? 'black' : 'green'); // ✅
        // setHeadSize(toggle ? 20 : 10); // ✅
        // setHeadColor(toggle ? 'purple' : 'pink'); // ✅
        // setCurviness(toggle ? 2 : 1); // ✅
        // setOffset(toggle ? 20 : 0); // ✅
        // setClassName(toggle ? 'custom-line' : ''); // ✅
        // setWithHead(!withHead); // ✅
        // setBlockId(toggle ? 'block2' : 'block1'); // ✅
        // setStrokeWidth(toggle ? 5 : 1); // ✅

        // need to check hover path
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
                <div id="block1" className="block" />
            </Draggable>
            <Draggable
                onDrag={handleUpdate}
                onStart={handleUpdate}
                onStop={handleUpdate}
                defaultPosition={{ x: 250, y: 500 }}
                scale={scale}
            >
                <div id="block2" className="block" />
            </Draggable>

            {/* {toggle && ( */}
                <Arrow
                    start={blockId}
                    end="block2"
                    color={color}
                    strokeWidth={strokeWidth}
                    headSize={headSize}
                    withHead={withHead}
                    headColor={headColor}
                    curviness={curviness}
                    offsetStartY={offset}
                    offsetEndY={-offset}
                    className={className}
                    onHover={toggle ? hoverHandlers[2] : hoverHandlers[1]}
                    // onClick={onClick}
                    label={<p className='label'>baana-react</p>}
                    useRegister={true}
                    Marker={CustomMarker}
                />
            {/* )} */}

            <button onClick={clickHandler} className="toggle">
                toggle
            </button>
        </>
    );
};

export const App = () => {
    const [scale, setScale] = useState(1);

    const onMouseWheel = (e) => {
        let scrollDelta = -e.deltaY;
        setScale(scale + scrollDelta / 500);
    };

    return (
        <>
            <Draggable scale={scale}>
                <LineContextProvider
                    className="dragContainer"
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
