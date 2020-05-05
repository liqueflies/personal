<script context="module">
  import { onMount, setContext } from 'svelte';
  import isMobile from 'is-mobile';

  import {
    key,
    width,
    height,
    canvas as canvasStore,
    context as contextStore,
    pixelRatio,
    props,
    time,
  } from '../context/canvas';
</script>

<script>
  export let killLoopOnError = true;

  let listeners = []; 

  let canvas;
  let context;
  let frame;

  onMount(() => {
    if (isMobile({featureDetect: true, tablet: false})) {
      return false;
    }
  
    handleResize();
    // prepare canvas stores
    context = canvas.getContext('2d');
    canvasStore.set(canvas);
    contextStore.set(context);

    listeners.forEach(async entity => {
      if (entity.setup) {
        let p = entity.setup($props);
        if (p && p.then) await p;
      }
      entity.ready = true;
    });
  
    // start game loop
    return createLoop((elapsed, dt) => {
      time.set(elapsed);
      render(dt);
    });
  });

  setContext(key, {
    add (fn) {
      this.remove(fn);
      listeners.push(fn);
    },
    remove (fn) {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  });
  
  function render (dt) {
    context.save();
    context.scale($pixelRatio, $pixelRatio);

    context.clearRect(0, 0, $width, $height);

    listeners.forEach(entity => {
      try {
        if (entity.mounted && entity.ready && entity.render) {
          entity.render($props, dt);
        }
      } catch (err) {
        console.error(err);
        if (killLoopOnError) {
          cancelAnimationFrame(frame);
          console.warn('Animation loop stopped due to an error');
        }
      }
    });
    context.restore();
  }

  function handleResize () {
    width.set(window.innerWidth);
    height.set(window.innerHeight);
    pixelRatio.set(Math.min(1.5, window.devicePixelRatio || 1));
  }

  function createLoop (fn) {
    let elapsed = 0;
    let lastTime = performance.now();
    (function loop() {
      frame = requestAnimationFrame(loop);
      const beginTime = performance.now();
      const dt = (beginTime - lastTime) / 1000;
      lastTime = beginTime;
      elapsed += dt;
      fn(elapsed, dt);
    })();
    return () => {
      cancelAnimationFrame(frame);
    };
  }
</script>

<style>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 5;

  pointer-events: none;
}
</style>

<canvas
  bind:this={canvas}
  width={$width * $pixelRatio}
  height={$height * $pixelRatio}
  style="width: {$width}px; height: {$height}px;"
/>
<svelte:window on:resize|passive={handleResize} />
<slot></slot>