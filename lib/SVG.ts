export type SVGContainerPropsType  ={
    container: HTMLElement;
    className?: string;
};

export class SVGContainer {
    svg: SVGElement;
    container: HTMLElement;

    constructor({ container, className }: SVGContainerPropsType) {
        this.svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        this.svg.style.overflow = 'visible';

        if (className) {
            this.svg.classList.add(className);
        }

        this.container = container;
        this.container.appendChild(this.svg);
    }
}