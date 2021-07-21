<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
    let shown = false;
    let editor;
    export function show() {
        shown = true;
    }
    export function hide() {
        shown = false;
    }
</script>

{#if shown}
    <div class="wrapper">
        <div class="editor" bind:this={editor}>
            <button class="close" on:click={hide}>
                &times
            </button>
            <slot/>
        </div>
    </div>
{/if}

<style>
    .wrapper {
        background-color: rgba(0, 0, 0, 0.6);
        position:fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .editor {
        background-color: whitesmoke;
        max-width: 60vw;
        padding: 1rem;
        margin: 15% auto;
    }
    .close {
        float:right;
    }
</style>
