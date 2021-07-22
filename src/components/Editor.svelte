<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let card;

    function removeLink(link) {
        card.links.splice(card.links.indexOf(link), 1);
        dispatch("onedit");
    }
    function addLink() {
        card.links.push({});
        dispatch("onedit");
    }
</script>

<form action="javascript:void(0);" on:change={() => dispatch("onedit")}>
    <div>
        <label for="width">Width</label>
        <input name="width" type="number" bind:value={card.width} />
        <label for="height">Height</label>
        <input name="height" type="number" bind:value={card.height} />
    </div>
    <div>
        <input
            class="grow-1"
            placeholder="Section Name"
            bind:value={card.title.name}
        />
        <input class="grow-3" placeholder="Link" bind:value={card.title.link} />
    </div>
    {#each card.links as link}
        <div>
            <button class="editor-button" on:click={() => removeLink(link)}>
                &minus
            </button>
            <input class="grow-1" placeholder="Name" bind:value={link.name} />
            <input class="grow-3" placeholder="Link" bind:value={link.link} />
        </div>
    {/each}

    <button class="editor-button" on:click={addLink}>&plus</button>
</form>

<style>
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
        padding: 0;
    }

    .editor-button:hover {
        background-color: rgb(200, 200, 200);
    }
</style>
