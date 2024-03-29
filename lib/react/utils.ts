export const debounce = (
    mainFunction: (...args: unknown[]) => unknown,
    delay: number
) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: unknown[]) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            mainFunction(...args);
        }, delay);
    };
};
