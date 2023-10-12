export class Label {
    label: HTMLElement;
    container: HTMLElement;

    constructor({ container, text }: { container: HTMLElement; text: string }) {
        this.label = document.createElement('div');
        this.label.classList.add('line-label');
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
