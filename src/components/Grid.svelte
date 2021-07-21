<script>
    export let data;
    import { onMount } from "svelte";
    export let gridWidth = 10,
        gridHeight = 20;

    let gridContainer;

    let movingElement = {
        active: false,
    };
    let widths, heights, columnGap, rowGap;
    onMount(() => {
        widths = getComputedStyle(gridContainer)
            ["grid-template-columns"].split("px")
            .map(parseFloat);
        heights = getComputedStyle(gridContainer)
            ["grid-template-rows"].split("px")
            .map(parseFloat);
        columnGap =
            getComputedStyle(gridContainer)["column-gap"].split("px")[0] | 0;
        rowGap =
            getComputedStyle(gridContainer)["column-gap"].split("px")[0] | 0;
    });

    function getGridCoordinates(x, y) {
        let sum = 0;
        let gridX = widths.length - 1;
        for (let i = 0; i < widths.length; i++) {
            sum += (widths[i] + columnGap) / 2;
            if (x < sum) {
                gridX = i;
                break;
            }
            sum += (widths[i] + columnGap) / 2;
        }
        sum = 0;
        let gridY = heights.length - 1;
        for (let i = 0; i < heights.length; i++) {
            sum += (heights[i] + rowGap) / 2;
            if (y < sum) {
                gridY = i;
                break;
            }
            sum += (heights[i] + rowGap) / 2;
        }
        return { x: gridX, y: gridY };
    }

    function onCardClicked(event) {
        if (event.button != 0) return
        const index = parseInt(event.target.id.split("-")[1]);
        const rect = event.target.getBoundingClientRect();
        const gridCoordinates = { x: data[index].x, y: data[index].y };
        movingElement = {
            index,
            active: true,
            offsetX: event.clientX - rect.x,
            offsetY: event.clientY - rect.y,
            absWidth: event.target.clientWidth,
            absHeight: event.target.clientHeight,
            absX: rect.x,
            absY: rect.y,
            x: gridCoordinates.x,
            y: gridCoordinates.y,
            width: data[index].width,
            height: data[index].height,
        };
    }

    function onCardDrop() {
        if (!movingElement.active) return;
        const rect = gridContainer.getBoundingClientRect();
        let gridCoordinates = getGridCoordinates(
            movingElement.absX - rect.x,
            movingElement.absY - rect.y
        );
        if (gridCoordinates.x + movingElement.width > gridWidth) {
            data[movingElement.index].x = gridWidth - movingElement.width;
        } else {
            data[movingElement.index].x = gridCoordinates.x;
        }
        if (gridCoordinates.y + movingElement.height > gridHeight) {
            data[movingElement.index].y = gridHeight - movingElement.height;
        } else {
            data[movingElement.index].y = gridCoordinates.y;
        }
        data = data;
        movingElement = { index: movingElement.index, active: false };
    }

    function onCardDrag(event) {
        if (!movingElement.active) return;
        movingElement.absX = event.clientX - movingElement.offsetX;
        movingElement.absY = event.clientY - movingElement.offsetY;
        const rect = gridContainer.getBoundingClientRect();
        const gridCoordinates = getGridCoordinates(
            movingElement.absX - rect.x,
            movingElement.absY - rect.y
        );
        if (gridCoordinates.x + movingElement.width > gridWidth) {
            movingElement.x = gridWidth - movingElement.width;
        } else {
            movingElement.x = gridCoordinates.x;
        }
        if (gridCoordinates.y + movingElement.height > gridHeight) {
            movingElement.y = gridHeight - movingElement.height;
        } else {
            movingElement.y = gridCoordinates.y;
        }
        movingElement = movingElement;
    }
</script>

<div
    class="canvas-container"
    style="
    grid-template-columns: repeat({gridWidth}, 1fr);
    grid-template-rows: repeat({gridHeight}, 1fr);
    gap: 1rem;
    "
    bind:this={gridContainer}
    on:mouseup={onCardDrop}
    on:mousemove={onCardDrag}
>
    {#if movingElement.active}
        <div
            style="grid-column: {movingElement.x +
                1} / span {movingElement.width}; grid-row: {movingElement.y +
                1} / span {movingElement.height};background-color: #f2f2ee;"
        />
    {/if}
    {#each data as current, i}
        {#if movingElement.active && movingElement.index == i}
            <div
                class="card"
                style="opacity: 0.5; position: absolute; cursor: grab; left: {movingElement.absX}px; top: {movingElement.absY}px; width: {movingElement.absWidth}px; height: {movingElement.absHeight}px"
            >
                <slot {current} />
            </div>
        {:else}
            <div
                class="card"
                style="grid-column: {current.x +
                    1} / span {current.width}; grid-row: {current.y +
                    1} / span {current.height};"
                on:mousedown|self={onCardClicked}
                id="card-{i}"
            >
                <slot {current} />
            </div>
        {/if}
    {/each}
</div>

<style>
    .canvas-container {
        display: grid;
        height: 100%;
    }

    .card {
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
            rgba(0, 0, 0, 0.24) 0px 1px 2px;
        padding: 5px;
        overflow: hidden;
        cursor: move;
    }

    .card :global(div) {
        cursor: default;
    }
</style>
