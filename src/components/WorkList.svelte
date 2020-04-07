<script context="module">
  import Work from '../components/Work.svelte';
</script>

<script>
  export let posts;
</script>

<div class="l-container">
	{#each posts as post}
		<Work data={post.data} />
	{/each}
</div>