export type LabelPropsType = { container: HTMLElement; text: string, className?: string };

export class Label {
    label: HTMLElement;
    container: HTMLElement;

    constructor({ container, text, className }: LabelPropsType) {
        this.label = document.createElement('div');
        this.label.classList.add('svg-curve-arrow__line-label');
        if (className) {
            this.label.classList.add(className);
        }
        this.label.innerHTML = text;

        this.container = container;
        this.container.appendChild(this.label);
    }

    setPos(x: number, y: number) {
        this.label.style['top'] = `${y}px`;
        this.label.style['left'] = `${x}px`;
    }

    setText(text: string) {
        this.label.innerHTML = text;
    }
}
