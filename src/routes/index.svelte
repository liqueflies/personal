<script context="module">
	import Hero from '../components/Hero.svelte'
	import About from '../components/About.svelte'
	import WorkList from '../components/WorkList.svelte'

  export async function preload({ params, query }) {
		const { results } = await this.fetch(`index.json`).then(r => r.json());
		return { posts: results };
  }
</script>

<script>
	export let posts;
</script>

<svelte:head>
	<title>Lorenzo Girardi</title>
</svelte:head>

<Hero />
<About />
<WorkList posts={posts} />
