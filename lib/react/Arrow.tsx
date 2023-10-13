import { useEffect, useState } from 'react';
import { Line, LineFactory, useLineContext, ReactLabel } from '..';
import { PointObj } from '../utils';
import { LabelPropsType } from '../Label';
import { LinePropsType } from '../Line';

export type Render = (start: PointObj, end: PointObj) => void;

type ArrowProps = {
    startRef: React.RefObject<HTMLElement>;
    endRef: React.RefObject<HTMLElement>;
};

export const Arrow: React.FC<
    ArrowProps & {
        text: LabelPropsType['text'];
        color: LinePropsType['strokeColor'];
        label?: ReturnType<typeof ReactLabel>;
    }
> = ({ startRef, endRef, color, text, label }) => {
    const { getContainer, getMarker, register, getConfig } = useLineContext();

    const [arrow, setArrow] = useState<Line | null>(null);

    const container = getContainer();

    useEffect(() => {
        if (container && arrow?.container !== container) {
            arrow?.container.removeChild(arrow?.svg);

            const marker = getMarker();
            const config = getConfig();

            const { line } = LineFactory({
                container,
                marker: marker ?? undefined,
                strokeColor: color ?? config.color,
                labelText: text,
                labelClassName: config.labelClassName,
                customLabel: label?.controller,
            });

            setArrow(line);

            const updateLine = () => {
                if (line && startRef.current && endRef.current) {
                    const rect1 = startRef.current.getBoundingClientRect();
                    const rect2 = endRef.current.getBoundingClientRect();

                    const start = {
                        x: rect1.x + rect1.width,
                        y: rect1.y + rect1.height / 2,
                    };

                    const end = {
                        x: rect2.x,
                        y: rect2.y + rect2.height / 2,
                    };

                    line.render(start, end);
                }
            };

            register(updateLine);
        }
    }, [container]);

    return label?.render();
};
