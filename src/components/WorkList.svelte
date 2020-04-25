<script context="module">
  import Work from "../components/Work.svelte";
</script>

<script>
  export let posts;
</script>

<div class="l-container l-container--full">
  {#each posts as post}
    <Work data={post.data} uid={post.uid} />
  {/each}
</div>
