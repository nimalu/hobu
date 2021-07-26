<script>
  import { onMount } from "svelte";
  import Grid from "./components/Grid.svelte";
  import Menu from "./components/Menu.svelte";
  import Modal from "./components/Modal.svelte";
  import MenuItem from "./components/MenuItem.svelte";
  import MenuDivider from "./components/MenuDivider.svelte";
  import Editor from "./components/Editor.svelte";
  import { HsvPicker } from "svelte-color-picker";

  let modal,
    cardMenu,
    outsideMenu,
    cards = [],
    coloModal,
    editingIndex = 0,
    color = { r: 255, g: 255, b: 255, a: 1.0 };

  function setConfig(storeString) {
    const store = JSON.parse(storeString);
    cards = store.cards;
    color = store.color;
  }

  function readConfig() {
    const storeElement = document.getElementById("hidden-store");
    if (storeElement) {
      setConfig(storeElement.innerHTML);
    }
  }

  onMount(readConfig);

  function onRightClick(e) {
    if (e.detail.card) {
      cardMenu.show(e.detail.pos);
      outsideMenu.hide()
      editingIndex = cards.indexOf(e.detail.card);
    } else {
      outsideMenu.show(e.detail.pos);
      cardMenu.hide()
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

  function reset(content) {
    const replacement = JSON.stringify({ cards, color });
    content = content.replace(
      new RegExp('<div id="hidden-store">([^><]{30,})</div>', "s"),
      `<div id="hidden-store">${replacement}</div>`
    );
    content = content.substring(0, content.lastIndexOf('<div id="hidden-store">'));
    content += '<div id="app"></div></body></html>';
    return content;
  }

  function download() {
    let source = document.getElementsByTagName("html")[0].outerHTML;
    source = reset(source);
    downloadFile(source, "index.html");
  }

  function changeColor() {
    coloModal.show();
  }

  function colorCallback(rgba) {
    color = rgba.detail;
  }

  function loadFile(callback) {
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      var reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = (readerEvent) => callback(readerEvent.target.result);
    };
    input.click();
  }

  function loadUpdated() {
    function resetHtml(html) {
      document.open();
      document.write(html);
      document.close();
    }
    loadFile((content) => resetHtml(reset(content)));
  }

  function loadOld() {
    loadFile((content) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(content, "text/html");
      setConfig(doc.getElementById("hidden-store").innerHTML)
    });
  }

  let cssColor;
  $: cssColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
</script>

<Menu bind:this={cardMenu}>
  <MenuItem on:onaction={modal.show}>Edit</MenuItem>
  <MenuItem on:onaction={deleteCard}>Delete</MenuItem>
  <MenuDivider />
  <MenuItem on:onaction={addCard}>New Card</MenuItem>
  <MenuItem on:onaction={changeColor}>Change Color</MenuItem>
  <MenuItem on:onaction={download}>Download</MenuItem>
  <MenuDivider />
  <MenuItem on:onaction={loadUpdated}>Load update</MenuItem>
  <MenuItem on:onaction={loadOld}>Load cards</MenuItem>
</Menu>

<Menu bind:this={outsideMenu}>
  <MenuItem on:onaction={addCard}>New Card</MenuItem>
  <MenuItem on:onaction={changeColor}>Change Color</MenuItem>
  <MenuItem on:onaction={download}>Download</MenuItem>
  <MenuDivider />
  <MenuItem on:onaction={loadUpdated}>Load update</MenuItem>
  <MenuItem on:onaction={loadOld}>Load cards</MenuItem>
</Menu>

<Modal bind:this={modal}>
  <Editor card={cards[editingIndex]} on:onedit={() => (cards = cards)} />
</Modal>

<Modal bind:this={coloModal}>
  <HsvPicker on:colorChange={colorCallback} />
</Modal>

<Grid let:current data={cards} on:onrightclick={onRightClick}>
  <div class="card" style={`--custom-color: ${cssColor};`}>
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

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    color: var(--custom-color);
    filter: brightness(95%);
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
    color: var(--custom-color);
    padding: 0.5rem;
  }

  hr {
    margin: 0.3rem 1rem;
    border: 0;
    border-bottom: 1px solid var(--custom-color);
  }

  ul {
    list-style: none;
    padding: 0;
  }
</style>
