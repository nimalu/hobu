<script>
  import Grid from "./components/Grid.svelte";
  import Menu from "./components/Menu.svelte";
  import Editor from "./components/Editor.svelte";
  import MenuItem from "./components/MenuItem.svelte";
  import MenuDivider from "./components/MenuDivider.svelte";
  let editor;
  const tempCards = [
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
        name: "Card 2",
      },
      x: 4,
      y: 1,
      width: 3,
      height: 4,
      links: [],
    },
    {
      title: {
        name: "Card 3",
      },
      x: 2,
      y: 5,
      width: 1,
      height: 4,
      links: [],
    },
  ];
  let cards = tempCards;
  console.log(document.getElementById("hidden-store"));
  import { onMount } from "svelte";
  onMount(() => {
    const store = document.getElementById("hidden-store");
    if (store) {
      cards = JSON.parse(store.innerHTML);
    }
  });
  let cardMenu, outsideMenu;
  let editingIndex = 0;
  function onRightClick(e) {
    if (e.detail.card) {
      cardMenu.show(e.detail.pos);
      editingIndex = cards.indexOf(e.detail.card);
    } else {
      outsideMenu.show(e.detail.pos);
    }
  }
  function addLink(card) {
    card.links.push({});
    cards = cards;
  }
  function removeLink(card, link) {
    card.links.splice(card.links.indexOf(link), 1);
    cards = cards;
  }
  function addCard() {
    cards.push({
      title: { name: "" },
      x: 0,
      y: 0,
      links: [],
      width: 2,
      height: 3,
    });
    cards = cards;
    editingIndex = cards.length - 1;
    editor.show();
  }
  function deleteCard() {
    cards.splice(editingIndex, 1);
    cards = cards;
  }
  function download() {
    let source = document.getElementsByTagName("html")[0].outerHTML;
    source = source.replace(
      new RegExp('<div id="hidden-store">([^><]{30,})</div>'),
      `<div id="hidden-store">${JSON.stringify(cards)}</div>`
    );
    source = source.substring(0, source.lastIndexOf('<div id=\"app\">'));

    source += '<div id="app"></div></body></html>';
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(source)
    );
    element.setAttribute("download", "index.html");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<Menu bind:this={cardMenu}>
  <MenuItem on:onaction={editor.show}>Edit</MenuItem>
  <MenuItem on:onaction={deleteCard}>Delete</MenuItem>
  <MenuDivider />
  <MenuItem on:onaction={addCard}>New Card</MenuItem>
</Menu>

<Menu bind:this={outsideMenu}>
  <MenuItem on:onaction={addCard}>New Card</MenuItem>
  <MenuItem on:onaction={download}>Download</MenuItem>
</Menu>

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
        <button
          class="editor-button"
          on:click={(e) => removeLink(cards[editingIndex], link)}>&minus</button
        >
        <input class="grow-1" placeholder="Name" bind:value={link.name} />
        <input class="grow-3" placeholder="Link" bind:value={link.link} />
      </div>
    {/each}

    <button class="editor-button" on:click={() => addLink(cards[editingIndex])}
      >&plus</button
    >
  </form>
</Editor>

<Grid let:current data={cards} on:onrightclick={onRightClick}>
  <div class="card">
    <a target="_blank" href={current.title.link}>
      <h2>{current.title.name}</h2>
    </a>

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

  :global(#hidden-store) {
    display: none;
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

  .card {
    color: rgb(0, 0, 0);
    padding: 0.5rem;
  }

  hr {
    margin: 0.3rem 1rem;
    border: 0;
    border-bottom: 1px solid black;
  }

  ul {
    list-style: none;
    padding: 0;
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
