import { Marker, LineFactory } from './lib/index.ts';

const { block1, block2, svgContainer } = window;

$('#block1').draggable();
$('#block2').draggable();

const marker = new Marker({
    container: svgContainer,
});

const props = {
    sizeLabel: 1,
    sizeArrow: 1,
};

// const gui = new dat.GUI({ name: 'Curves' });
// gui.add(props, 'sizeLabel');
// gui.add(props, 'sizeArrow');

const { line } = LineFactory({
    container: svgContainer,

    strokeColor: 'red',

    marker,
    markerColor: 'blue',
    markerSize: 16,

    labelText: 'Label text',
});

const render = () => {
    const rect1 = block1.getBoundingClientRect();
    const rect2 = block2.getBoundingClientRect();

    const start = {
        x: rect1.x + rect1.width,
        y: rect1.y + rect1.height / 2,
    };

    const end = {
        x: rect2.x,
        y: rect2.y + rect2.height / 2,
    };

    line.render(start, end);

    requestAnimationFrame(render);
};

render();
