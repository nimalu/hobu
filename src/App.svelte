<script>
  import Grid from "./components/Grid.svelte";
  import Menu from "./components/Menu.svelte";
  import Editor from "./components/Editor.svelte";
  let editor;
  let cards = [
    {
      title: {
        name: "Card 1",
      },
      x: 2,
      y: 1,
      width: 1,
      height: 4,
      links: [
        {
          name: "Link 1",
        },
        {
          name: "Übungen",
        },
      ],
    },
    {
      title: {
        name: "Da",
      },
      x: 4,
      y: 1,
      width: 3,
      height: 4,
      links: [],
    },
    {
      title: {
        name: "GDsf",
      },
      x: 2,
      y: 5,
      width: 1,
      height: 4,
      links: [],
    },
  ];
  let menuPos,
    showMenu = false;
  let editingIndex = 0;
  function onRightClick(e, card) {
    menuPos = { x: e.clientX, y: e.clientY };
    showMenu = true;
    editingIndex = cards.indexOf(card);
  }
  function showEditor() {
    editor.show();
  }
  function addLink(card) {
    card.links.push({})
    cards = cards
  }
  function removeLink(card, link) {
    card.links.splice(card.links.indexOf(link), 1)
    cards = cards
  }
</script>

{#if showMenu}
  <Menu
    pos={menuPos}
    on:onclickoutside={() => (showMenu = false)}
    on:onedit={showEditor}
  />
{/if}

<Editor bind:this={editor}>
  <form action="javascript:void(0);">
    <div>
      <label for="width">Width</label>
      <input
        name="width"
        type="number"
        bind:value={cards[editingIndex].width}
      />
      <label for="height">Height</label>
      <input
        name="height"
        type="number"
        bind:value={cards[editingIndex].height}
      />
    </div>
    <div>
      <input
        class="grow-1"
        placeholder="Section Name"
        bind:value={cards[editingIndex].title.name}
      />
      <input
        class="grow-3"
        placeholder="Link"
        bind:value={cards[editingIndex].title.link}
      />
    </div>
    {#each cards[editingIndex].links as link}
      <div>
        <button class="editor-button" on:click={e => removeLink(cards[editingIndex], link)}>&minus</button>
        <input class="grow-1" placeholder="Name" bind:value={link.name} />
        <input class="grow-3" placeholder="Link" bind:value={link.link} />
      </div>
    {/each}

    <button class="editor-button" on:click={e => addLink(cards[editingIndex])}>&plus</button>
  </form>
</Editor>

<Grid let:current data={cards}>
  <div
    class="card"
    on:contextmenu|preventDefault={(e) => onRightClick(e, current)}
  >
    <a target="_blank" href={current.title.link}
      ><h2>{current.title.name}</h2></a
    >

    <hr />
    <ul>
      {#each current.links as link}
      {#if "name" in link}
      <a target="_blank" href={link.link}><li>{link.name}</li></a>
      {/if}
      {/each}
    </ul>
  </div>
</Grid>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    text-align: center;
  }
  :global(body),
  :global(html) {
    height: 99%;
  }

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    color: rgb(70, 70, 70);
  }

  :global(#app) {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  * {
    padding: 0;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  hr {
    color: rgb(216, 216, 216);
  }

  form {
    display: flex;
    flex-direction: column;
  }

  .grow-1 {
    flex-grow: 1;
  }

  .grow-3 {
    flex-grow: 3;
  }

  form div {
    display: flex;
  }

  label {
    padding: 10px;
  }

  input {
    padding: 10px;
    border: 0;
    border-bottom: 1px solid #eee;
    margin: 5px;
  }

  input[type="number"] {
    margin-right: 2rem;
    width: 3rem;
  }

  .editor-button {
    background-color: rgb(238, 238, 238);
    font-weight: bold;
    border: 0;
    margin: 5px;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }
</style>
