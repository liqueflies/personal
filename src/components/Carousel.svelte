<script>
  import { onMount } from "svelte";

  // Props
  export let items = [...Array(12).keys()];
  export let scrollBy = 1;

  let parentElement;

  $: offset = page * (scrollBy - 1);
  $: page = 1;

  $: atStart = page === 1;
  $: parentWidth = 0;
  $: children = null;
  // $: atEnd = offset <= paginationFactor * (items.length - scrollBy) * -1;

  $: widths = [];

  const firstGte = w => {
    for (let i = 0; i < widths.length; i++) {
      if (widths[i] >= w) return i;
    }
    return -1;
  };

  const move = direction => {
    page += direction;
    elements[firstGte(parentWidth * (page - 1))].scrollIntoView({
      behavior: "smooth"
    });
  };

  // onMount(() => {
  //   parentWidth = parentElement.clientWidth;
  //   children = parentElement.children;
  //   widths = children.map(e => e.offsetLeft);
  // });
</script>

<main>
  <div class="items" bind:this={parentElement}>
    {#each items as item, i}
      <div class="item" style="background-color: hsla({i * 25}deg, 75%, 55%);">{item}</div>
    {/each}
  </div>
  <button on:click="{() => move(-1)}">&lsaquo; Prev</button>
  <button on:click="{() => move(1)}">Next &rsaquo;</button>

  <div class="details">
    offset: {offset}<br>
    page: {page}<br>
    widths: {widths}
    <!-- atStart: {atStart}<br>
    atEnd: {atEnd} -->
  </div>
</main>

<style>
  main {
    /* width: 700px; */
    overflow: hidden;
  }

  .items {
    display: flex;
    transition: transform 0.4s ease-in-out;
    transform: translateX(0px);
  }

  .item {
    min-width: 167px;
    height: 100px;
    margin: 0 4px;
    background-color: #ef4322;
    border-radius: 0.7rem;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 10rem;
    user-select: none;
    overflow: hidden;
  }

  .items .item:first-child {
    margin-left: 0;
  }

  .items .item:nth-child(2n) {
    min-width: 200px;
  }

  .items .item:last-child {
    margin-right: 0;
  }

  .details {
    margin-top: 20px;
    font-style: italic;
    color: #9f9f9f;
  }

  @media screen and (min-width: 40em) {
    main {
      display: none;
    }
  }
</style>