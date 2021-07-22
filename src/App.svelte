<script>
  import { onMount } from "svelte";
  import Grid from "./components/Grid.svelte";
  import Menu from "./components/Menu.svelte";
  import Modal from "./components/Modal.svelte";
  import MenuItem from "./components/MenuItem.svelte";
  import MenuDivider from "./components/MenuDivider.svelte";
  import Editor from "./components/Editor.svelte";

  let modal,
    cardMenu,
    outsideMenu,
    cards = [],
    editingIndex = 0;

  function readCards() {
    const store = document.getElementById("hidden-store");
    if (store) {
      cards = JSON.parse(store.innerHTML);
    }
  }

  onMount(readCards);

  function onRightClick(e) {
    if (e.detail.card) {
      cardMenu.show(e.detail.pos);
      editingIndex = cards.indexOf(e.detail.card);
    } else {
      outsideMenu.show(e.detail.pos);
    }
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
    modal.show();
  }

  function deleteCard() {
    cards.splice(editingIndex, 1);
    cards = cards;
  }

  function downloadFile(content, name) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function download() {
    let source = document.getElementsByTagName("html")[0].outerHTML;
    source = source.replace(
      new RegExp('<div id="hidden-store">([^><]{30,})</div>'),
      `<div id="hidden-store">${JSON.stringify(cards)}</div>`
    );
    source = source.substring(0, source.lastIndexOf('<div id="app">'));
    source += '<div id="app"></div></body></html>';
    downloadFile(source, "index.html");
  }
</script>

<Menu bind:this={cardMenu}>
  <MenuItem on:onaction={modal.show}>Edit</MenuItem>
  <MenuItem on:onaction={deleteCard}>Delete</MenuItem>
  <MenuDivider />
  <MenuItem on:onaction={addCard}>New Card</MenuItem>
</Menu>

<Menu bind:this={outsideMenu}>
  <MenuItem on:onaction={addCard}>New Card</MenuItem>
  <MenuItem on:onaction={download}>Download</MenuItem>
</Menu>

<Modal bind:this={modal}>
  <Editor card={cards[editingIndex]} on:onedit={() => (cards = cards)} />
</Modal>

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
</style>
