# baana-react

## Usage

```jsx
const Diagram = () => {
    return (
        <>
            <div id="block1"></div>
            <div id="block2"></div>
            <Arrow start="block1" end="block2"/>
        </>
    );
}

const App = () => {
    return (
        <LineContextProvider>
            <Diagram />
        </LineContextProvider>
    )
}
```

## Features

### Config all arrows at context at once

The following properties can be set via context: `scale`, `offset`, `color`, `curviness`, `arrowClassName`, `strokeWidth`, `onlyIntegerCoords`, `useRegister`, `withHead`, `headColor`, `headSize`, `labelClassName`.

## Optimization

### Hook useReducedGraphics

- It is needed to increase FPS due to a temporary decrease in rendering quality
- Default delay: `400 ms`
- Based on `shape-rendering: optimizeSpeed` [[MDN]](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering)

```jsx
const { reducedClassName, reduceSVG } = useReducedGraphics();

const someAction = () => {
    ...
    reduceSVG();
}

return (
    <LineContextProvider arrowClassName={reducedClassName}>
        ... // arrows and other content
    </LineContextProvider>
);
```

### Only integer coords

Some operations like scaling or moving whole space can cause a small recalculation of the coordinates of the arrows with an accuracy of up to one thousandth. And `onlyIntegerCoords` can reduce the load. *But at high magnification, this can cause unpleasant twitching of the lines.*

### Update only changed arrows

This feature is hidden behind the property `useRegister`, as it requires a little extra memory.

After enabling, you can pass the HTML element corresponding to the `start` or `end` of the arrow to the update function.

<details>
    <summary>Example</summary>

    Made with `react-draggable`.

    ```jsx
    const Diagram = () => {
        const { update } = useLineContext();

        const handleUpdate = (mouseEvent, dragEvent) => {
            update(dragEvent.node);
        };

        return (
            <>
                <Draggable
                    onDrag={handleUpdate}
                    onStart={handleUpdate}
                    onStop={handleUpdate}
                >
                    <div id="block1"></div>
                </Draggable>

                <Draggable
                    onDrag={handleUpdate}
                    onStart={handleUpdate}
                    onStop={handleUpdate}
                >
                    <div id="block2"></div>
                </Draggable>

                <Arrow start="block1" end="block2"/>
            </>
        );
    }

    const App = () => {
        return (
            <LineContextProvider>
                <Diagram />
            </LineContextProvider>
        )
    }
    ```

</details>
