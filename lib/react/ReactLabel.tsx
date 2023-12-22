import React, { ReactNode, useRef } from 'react';
import { LabelInterface } from '../Label';

export type ReactLabelType = {
    render: (shouldRender?: boolean) => JSX.Element | null;
    controller: LabelInterface;
};

export const ReactLabel = (children: ReactNode): ReactLabelType => {
    const labelRef = useRef<HTMLDivElement>(null);

    if (!children) {
        return {
            render: () => null,
            controller: { setPos: () => {} },
        };
    }

    const setPos = (x: number, y: number) => {
        if (labelRef.current) {
            labelRef.current.style['top'] = `${y}px`;
            labelRef.current.style['left'] = `${x}px`;
        }
    };

    return {
        render: (shouldRender = true) => (
            <div
                ref={labelRef}
                className="baana__line-label"
                style={{ display: shouldRender ? 'block' : 'none' }}
            >
                {children}
            </div>
        ),
        controller: {
            setPos,
        },
    };
};
