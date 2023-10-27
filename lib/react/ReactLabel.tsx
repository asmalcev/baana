import React, { ReactNode, useRef } from 'react';
import { LabelInterface } from '../Label';

export const ReactLabel = (
    children: ReactNode
): {
    render: () => JSX.Element | null;
    controller: LabelInterface;
} => {
    if (!children) {
        return {
            render: () => null,
            controller: { setPos: () => {} },
        };
    }

    const labelRef = useRef<HTMLDivElement>(null);

    const setPos = (x: number, y: number) => {
        if (labelRef.current) {
            labelRef.current.style['top'] = `${y}px`;
            labelRef.current.style['left'] = `${x}px`;
        }
    };

    return {
        render: () => (
            <div ref={labelRef} className="baana__line-label">
                {children}
            </div>
        ),
        controller: {
            setPos,
        },
    };
};
