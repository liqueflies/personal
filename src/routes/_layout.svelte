<script>
  import { onMount } from 'svelte';

	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';

  import { scrollInstance } from '../store';

  let rootRef;

  onMount(async () => {
    const LocomotiveModule = await import('locomotive-scroll');
    const LocomotiveScroll = LocomotiveModule.default;

    const scroll = new LocomotiveScroll({
      el: rootRef,
      smooth: true,
      getSpeed: true,
      getDirection: true,
      useKeyboard: true
    });

    scroll.on('scroll', instance => {
      scrollInstance.set(instance);
    });
  });
</script>

<style>
  main {
    position: relative;
  }
</style>

<main bind:this={rootRef} class="l-grid">
  <Header />
  <slot />
  <Footer />
</main>
