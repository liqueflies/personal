<script context="module">
  import { onMount, createEventDispatcher } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { RichText } from 'prismic-dom';

  import Card from '../components/Card';
  import { swipable } from '../context/swipe';
  import { scrollable } from '../context/scroll';
  import { lazyImage } from '../utils/lazy';
  import { lerp } from '../utils/math';
</script>

<script>
  export let uid;
  export let alt;
  export let src;
  export let index;
  export let active;
  export let next;
  export let subsequent;
  // export let parentEl;

  const dispatch = createEventDispatcher();

  let el;
  let imageEl;
  let hammer;
  let Hammer;

  let transX;
  let transY;
  let rotate;
  let rotateY;
  let scale;

  let transition;
  let dragPosition;

  let panning = false;
  let success = false;
  let scrolling = false;

  setInitialState();

  swipable(H => {
    Hammer = H;
    const hammer = new Hammer(el);

    hammer.add(new Hammer.Tap());
    hammer.add(new Hammer.Pan({
      position: Hammer.position_ALL, 
      threshold: 0,
      direction: Hammer.DIRECTION_HORIZONTAL
    }));
    
    // hammer.on('pan', handlePan);
    hammer.on('tap', handleTap);
  });

  scrollable({
    value: uid,
    scroll: () => {
      scrolling = true;
    },
    enter: async () => {
      await lazyImage(imageEl);
    }
  });

  function setInitialState() {
    transX = 0;
    transY = 0;
    rotate = 0;
    rotateY = 0;
    scale = 1;
  }

  function handleTouchEnd() {
    scrolling = false;
  }

  function handleTap(e) {
    dispatch('transitionend', {
      index
    });
  }

  // function handlePan(e) {
  //   if (!panning) {
  //     panning = true;
  //     transition = 'none';
  //     const bounds = el.getBoundingClientRect();
  //     dragPosition = (e.center.y - bounds.top) > el.clientHeight / 2 ? -1 : 1;
  //   }

  //   transX = e.deltaX;
  //   transY = e.deltaY;
    
  //   // get ratio between swiped pixels and the axes
  //   let propX = e.deltaX / parentEl.clientWidth;
  //   let propY = e.deltaY / parentEl.clientHeight;
    
  //   // get swipe direction, left (-1) or right (1)
  //   let dirX = e.deltaX < 0 ? -1 : 1;
    
  //   // calculate rotation, between 0 and +/- 45 deg
  //   rotate = dragPosition * dirX * Math.abs(propX) * 45;
    
  //   if (e.isFinal) {
  //     let _transX = transX;
  //     let _transY = transY;
      
  //     panning = false;
  //     transition = 'transform 200ms ease-out';
      
  //     // check threshold
  //     if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {
  //       success = true;
  //       _transX = (parentEl.clientWidth + el.clientWidth);
  //     } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {
  //       success = true;
  //       _transX = - (parentEl.clientWidth + el.clientWidth);
  //     } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {
  //       success = false;
  //     } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_DOWN) {
  //       success = false;
  //     }
      
  //     if (success) {
  //       transX = _transX;
  //       transY = _transY;
  //     } else {
  //       setInitialState();
  //     }
  //   }
  // }

  function handleTransitionEnd() {
    if (success) {
      dispatch('transitionend', {
        index
      });

      setTimeout(() => {        
        success = false;
        transition = 'transform 0s .45s';
        setInitialState();
      }, 50);
    }
  }
</script>

<svelte:window
  on:touchend={handleTouchEnd}
/>

<div 
  class="c-card"
  data-scroll
  data-scroll-offset="-100%"
  data-scroll-call={uid}
  class:active={active}
  class:next={next}
  class:subsequent={subsequent}
  bind:this={el}
  style="transition: {transition}; transform: translateX({transX}px) translateY({transY}px) rotate({rotate}deg) rotateY({rotateY}deg)"
  on:transitionend={handleTransitionEnd}
>
  <img data-src={src} alt={alt} bind:this={imageEl} />
</div>

<style>
.c-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

img {
  display: inline-block;
  /* transform: scale(0.95); */

  /* transition: transform 0.45s var(--ease-in-out); */
}

.c-card.active {
  z-index: 2;
}

.c-card.next {
  z-index: 1;
}

/* .c-card.next:nth-of-type(odd) img {
  transform: scale(0.95) rotate(4deg);
}

.c-card.next:nth-of-type(even) img {
  transform: scale(0.95) rotate(-4deg);
}

.c-card.subsequent:nth-of-type(odd) img {
  transform: scale(0.95) rotate(4deg);
}

.c-card.subsequent:nth-of-type(even) img {
  transform: scale(0.95) rotate(-4deg);
} */

/* .c-card.active img {
  transform: none;
} */
</style>