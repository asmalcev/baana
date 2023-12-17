import { useCallback, useState } from 'react';
import { debounce } from './utils';

export const useReducedGraphics = (delay: number = 400) => {
    const [isReduced, setIsReduced] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const increaseSVG = useCallback(
        debounce(() => setIsReduced(false), delay),
        [delay]
    );

    const reduceSVG = () => {
        setIsReduced(true);

        increaseSVG();
    };

    return {
        isReduced,
        increaseSVG,
        reduceSVG,
        reducedClassName: isReduced ? 'baana__reduced-svg' : '',
    };
};
