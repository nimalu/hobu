<script>
  let cards = [
    { title: "Hallo", x: 2, y: 1, width: 1, height: 1 },
    { title: "Du", x: 0, y: 1, width: 3, height: 1 },
    { title: "Da", x: 2, y: 3, width: 1, height: 1 },
  ];
  let movingElement = {
    active: false,
  };
  let gridContainer;
  function onCardClicked(event) {
    movingElement.index = event.target.id.split("-")[1] | 0;
    movingElement.active = true;
    const rect = event.target.getBoundingClientRect();
    movingElement.offsetX = event.clientX - rect.x;
    movingElement.offsetY = event.clientY - rect.y;
    movingElement.absWidth = event.target.clientWidth;
    movingElement.absHeight = event.target.clientHeight;
    movingElement.absX = event.clientX - movingElement.offsetX;
    movingElement.absY = event.clientY - movingElement.offsetY;
    const rect2 = gridContainer.getBoundingClientRect();
    const gridCoordinates = getGridCoordinates(
      movingElement.absX - rect2.x,
      movingElement.absY - rect2.y
    );
    movingElement.x = gridCoordinates.x;
    movingElement.y = gridCoordinates.y;
    movingElement.width = cards[movingElement.index].width;
    movingElement.height = cards[movingElement.index].height;
    movingElement = movingElement;
  }
  function getGridCoordinates(x, y) {
    const widths = getComputedStyle(gridContainer)
      ["grid-template-columns"].split("px")
      .map(parseFloat);
    const heights = getComputedStyle(gridContainer)
      ["grid-template-rows"].split("px")
      .map(parseFloat);
    const columnGap = getComputedStyle(gridContainer)
      ["column-gap"].split("px")[0] | 0
    const rowGap = getComputedStyle(gridContainer)
      ["column-gap"].split("px")[0]| 0
    let sum = 0;
    let gridX;
    for (let i = 0; i < widths.length; i++) {
      sum += (widths[i] + columnGap) / 2;
      if (x < sum) {
        gridX = i;
        break;
      }
      sum += (widths[i] + columnGap) / 2;
    }
    sum = 0;
    let gridY;
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
  function onCardDrop() {
    if (!movingElement.active) return;
    const rect = gridContainer.getBoundingClientRect();
    const gridCoordinates = getGridCoordinates(
      movingElement.absX - rect.x,
      movingElement.absY - rect.y
    );
    cards[movingElement.index].x = gridCoordinates.x;
    cards[movingElement.index].y = gridCoordinates.y;
    cards = cards;
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
    movingElement.x = gridCoordinates.x;
    movingElement.y = gridCoordinates.y;
    movingElement.width = cards[movingElement.index].width;
    movingElement.height = cards[movingElement.index].height;
    movingElement = movingElement;
  }
  //$: console.log(movingElement);
</script>

<main>
  <div
    class="canvas-container"
    on:mouseup={onCardDrop}
    on:mousemove={onCardDrag}
    bind:this={gridContainer}
  >
    {#if movingElement.active}
      <div
        style="grid-column: {movingElement.x+1} / span {movingElement.width}; grid-row: {movingElement.y+1} / span {movingElement.height};background-color: #eeeeee;"
      />
    {/if}
    {#each cards as card, i}
      {#if movingElement.active && movingElement.index == i}
        <div
          style="opacity: 0.5; position: absolute; cursor: grab; left: {movingElement.absX}px; top: {movingElement.absY}px; width: {movingElement.absWidth}px; height: {movingElement.absHeight}px"
        >
          {card.title}
        </div>
      {:else}
        <div
          style="grid-column: {card.x+1} / span {card.width}; grid-row: {card.y+1} / span {card.height};"
          on:mousedown={onCardClicked}
          id="card-{i}"
        >
          {card.title}
        </div>
      {/if}
    {/each}
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .canvas-container {
    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    grid-template-rows: repeat(10, 2rem);
    gap: 1rem;
  }

  .canvas-container * {
    min-width: 0;
    max-width: 100%;
    overflow: visible;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
