<script>
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
            <slot />
            <button class="close" on:click={hide}> &times </button>
        </div>
    </div>
{/if}

<style>
    .wrapper {
        background-color: rgba(0, 0, 0, 0.6);
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }
    .editor {
        background-color: whitesmoke;
        padding: 1rem;
        margin: 15% auto;
        width: max-content;
        align-items: flex-start;
        display: flex;
    }
    .close {
        margin-left: 1rem;
    }
</style>
