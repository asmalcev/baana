import { LineFactory, SVGContainer } from './lib/index.ts';

const { block1, block2, container } = window;

$('#block1').draggable();
$('#block2').draggable();

const svgContainer = new SVGContainer({ container });

const { line } = LineFactory({
    svg: svgContainer,

    strokeColor: 'red',

    withMarker: true,
    markerColor: 'blue',
    markerSize: 18,

    labelText: 'Label text',
    labelClassName: 'line-label',

    curviness: 1,
    className: 'custom-path',

    // offset: {
    //     end: [-20, 0],
    // },

    onHover: () => {
        console.log('hover');
    },
    onClick: () => {
        console.log('click');
    }
});

const render = () => {
    line.update(block1, block2);

    requestAnimationFrame(render);
};

render();
