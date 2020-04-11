<script>
  import { onMount } from 'svelte';

	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import Canvas from '../components/Canvas.svelte';

  import emitter from '../emitter';

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
      emitter.emit('scroll', instance);
      const isScrolling = instance.speed !== 0;
      document.documentElement.classList[isScrolling ? 'add' : 'remove']('is-scrolling');
    });

    scroll.on('call', (value, way, obj) => {
      emitter.emit('call', { value, way, obj });
    });
  });
</script>

<style>
  main {
    position: relative;
  }
</style>

<main bind:this={rootRef} class="l-grid">
  <Canvas>
    <Header />
    <slot></slot>
    <Footer />
  </Canvas>
</main>
