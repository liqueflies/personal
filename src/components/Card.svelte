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
  export let parentEl;

  const dispatch = createEventDispatcher();

  let el;
  let imageEl;
  let hammer;
  let Hammer;

  let transX;
  let transY = 0;
  let rotate;
  let rotateY;
  let scale;

  let transition;
  let dragPosition;

  let panning = false;
  let success = false;

  swipable(H => {
    Hammer = H;
    const hammer = new Hammer(el);

    hammer.add(new Hammer.Tap());
    hammer.add(new Hammer.Pan({
      position: Hammer.position_ALL, 
      threshold: 50, 
      direction: Hammer.DIRECTION_HORIZONTAL
    }));
    
    // pass events data to custom callbacks
    // hammer.on('tap', handleTap);
    // hammer.on('pan', handlePan);

    // setInitialTransform();
  });

  scrollable({
    value: uid,
    scroll: ({ scroll }) => {
      const speed = window.pageYOffset - scroll.y;
      console.log(scroll.y, window.pageYOffset, speed, transY)
      transY = lerp(transY, -((speed * 0.3) * index), 0.4);
    },
    enter: async () => {
      await lazyImage(imageEl);
    }
  });

  function setInitialTransform() {
    transX = 0;
    transY = 0;
    rotate = 0;
    rotateY = 0;
    scale = 1;
  }

  function handleTap(e) {
    let propX = (e.center.x - e.target.getBoundingClientRect().left) / e.target.clientWidth;
  
    // change the transition property
    transition = 'transform 100ms ease-out';

    // get degree of Y rotation (+/-15 degrees)
    rotateY = 15 * (propX < 0.05 ? -1 : 1);
  }

  function handlePan(e) {
    if (e.direction == Hammer.DIRECTION_UP) {
    }

    if (!panning) {
      panning = true;
      // remove transition properties
      transition = 'none';
      // get top card bounds
      const bounds = el.getBoundingClientRect();
      // get finger position on top card, top (1) or bottom (-1)
      dragPosition = (e.center.y - bounds.top) > el.clientHeight / 2 ? -1 : 1;
    }

    // calculate new coordinates
    transX = e.deltaX * 0.8;
    transY = e.deltaY * 0.8;
    
    // get ratio between swiped pixels and the axes
    let propX = e.deltaX / parentEl.clientWidth;
    let propY = e.deltaY / parentEl.clientHeight;
    
    // get swipe direction, left (-1) or right (1)
    let dirX = e.deltaX < 0 ? -1 : 1;
    
    // calculate rotation, between 0 and +/- 45 deg
    rotate = dragPosition * dirX * Math.abs(propX) * 45;
    
    if (e.isFinal) {
      let _transX = transX;
      let _transY = transY;
      
      panning = false;
      // set back transition properties
      transition = 'transform 200ms ease-out';
      
      // check threshold
      if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {
        success = true;
        // get right border position
        _transX = parentEl.clientWidth;
      } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {
        success = true;
        // get left border position
        _transX = - (parentEl.clientWidth + el.clientWidth);
      } 
      
      // else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {
      //   return false;
      // } 
      
      if (success) {
        transX = _transX;
        transY = _transY;
      } else {
        setInitialTransform();
      }
    }
  }

  function handleTransitionEnd() {
    if (success) {
      console.log(success, uid);
      dispatch('transitionend', {
        index
      });

      setInitialTransform();
      success = false;
    }
  }
</script>

<div 
  class="c-card"
  data-scroll
  data-scroll-offset="-100%"
  data-scroll-call={uid}
  class:active={active}
  class:next={next}
  bind:this={el}
  style="transform: translateY({transY}px)"
  on:transitionend={handleTransitionEnd}
>
  <!-- style="transform: translateX({transX}px) translateY({transY}px) rotate({rotate}deg) rotateY({rotateY}deg)" -->
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

/* img {
  display: inline-block;
  transform: scale(0.8);

  transition: transform 0.45s var(--ease-in-out);
} */

.c-card.active {
  z-index: 2;
}

.c-card.next {
  z-index: 1;
}

/* .c-card.active img {
  transform: none;
} */
</style>