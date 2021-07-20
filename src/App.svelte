<script>
  import { onMount } from "svelte";

  let cards = [
    {
      title: "Hallo",
      x: 2,
      y: 1,
      width: 1,
      height: 4,
      links: ["Vorlesungen", "Übungen"],
    },
    { title: "Du", x: 4, y: 1, width: 3, height: 4, links: [] },
    { title: "Da", x: 2, y: 5, width: 1, height: 4, links: [] },
  ];
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
    rowGap = getComputedStyle(gridContainer)["column-gap"].split("px")[0] | 0;
  });

  function getGridCoordinates(x, y) {
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


  function onCardClicked(event) {
    const index = parseInt(event.target.id.split("-")[1]);
    console.log(event.target.id)
    const rect = event.target.getBoundingClientRect();
    const gridCoordinates = {x: cards[index].x, y: cards[index].y}
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
      width: cards[index].width,
      height: cards[index].height,
    };
  }

  function onCardDrop() {
    if (!movingElement.active) return;
    const rect = gridContainer.getBoundingClientRect();
    let gridCoordinates = getGridCoordinates(
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
    movingElement = movingElement;
  }

  function onCardHover(e) {
    if (e.target !== e.currentTarget) return;
    console.count("border-hover");
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
        style="grid-column: {movingElement.x +
          1} / span {movingElement.width}; grid-row: {movingElement.y +
          1} / span {movingElement.height};background-color: #f2f2ee;"
      />
    {/if}
    {#each cards as card, i}
      {#if movingElement.active && movingElement.index == i}
        <div
          class="card"
          style="opacity: 0.5; position: absolute; cursor: grab; left: {movingElement.absX}px; top: {movingElement.absY}px; width: {movingElement.absWidth}px; height: {movingElement.absHeight}px"
        >
          <h2>{card.title}</h2>
        </div>
      {:else}
        <div
          class="card"
          style="grid-column: {card.x +
            1} / span {card.width}; grid-row: {card.y +
            1} / span {card.height};"
          on:mousedown|self={onCardClicked}
          id="card-{i}"
        >
            <h2>{card.title}</h2>
            <hr />
            <ul>
              {#each card.links as link}
                <li>
                  {link}
                </li>
              {/each}
            </ul>
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

  div * {
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  .canvas-container {
    display: grid;
    grid-template-columns: repeat(10, 10rem);
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

  .card {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    padding: 0.8rem;
  }

  .card hr {
    color: rgb(114, 114, 114);
    margin: 0.2rem 1rem;
  }
</style>
