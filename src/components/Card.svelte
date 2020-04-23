<script context="module">
  import { onMount, createEventDispatcher } from 'svelte';
  import { RichText } from 'prismic-dom';

  import Card from '../components/Card';
  import { scrollable } from '../context/scroll';
  import { lazyImage } from '../utils/lazy';
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

  let transX;
  let transY;
  let rotate;
  let rotateY;
  let scale;

  let transition;
  let dragPosition;

  let panning = false;
  let success = false;

  scrollable({
    value: uid,
    enter: async () => {
      await lazyImage(imageEl);
    }
  });

  onMount(async () => {
    const H = await import('hammerjs');
    const Hammer = H.default;

    hammer = new Hammer(el);
    hammer.add(new Hammer.Tap());
    hammer.add(new Hammer.Pan({
      position: Hammer.position_ALL, threshold: 0
    }));
    
    // pass events data to custom callbacks
    hammer.on('tap', handleTap);
    hammer.on('pan', handlePan);

    setInitialTransform();
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
        _transX = - (parentEl.clientWidth + el.clientWidth)
      
      } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {
        success = true;
        // get top border position
        _transY = - (parentEl.clientHeight + el.clientHeight)
      } 
      
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
  transform: scale(0.9);

  transition: transform 0.45s var(--ease-in-out);
}

.c-card.active {
  z-index: 2;
}

.c-card.next {
  z-index: 1;
}

.c-card.active img {
  transform: none;
}
</style>