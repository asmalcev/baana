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
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.classList.add('baana__svg');

        if (className) {
            this.svg.classList.add(className);
        }

        this.container = container;
        this.container.appendChild(this.svg);
    }
}