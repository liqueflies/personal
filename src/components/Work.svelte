<script context="module">
  import PrismicDOM from 'prismic-dom';
  import Spacer from '../components/Spacer.svelte';
</script>

<script>
  import { onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { sineOut } from 'svelte/easing'

  import emitter from '../emitter';

  export let uid;
  export let data;

  const CALL_VALUE = `work_${uid}`;

  const mX = tweened(0, { easing: sineOut });
  const mY = tweened(0, { easing: sineOut });
  
  let isActive = false;
  let vw, vh;

  import { renderable } from '../context/canvas';

	// renderable(props => {
  //   const { context, width, height } = props;
	// 	context.clearRect(0, 0, width, height);
  //   context.fillStyle = 'green';
  //   context.fillRect(0, 0, width, height);
  // });
  
  function onMouseMove() {}

  // function onMouseMove(e) {
  //   if (!isActive) {
  //     return false;
  //   }

  //   $mX = e.clientX - (vw * 0.5);
  //   $mY = e.clientY - (vh * 0.5);
  // }

  // function onCall({ value, way, obj }) {
  //   if (value === CALL_VALUE) {
  //     isActive = way === 'enter';

  //     // avoid continuously set to 0.
  //     if (!isActive && $mX !== 0 && !$mY !== 0) {
  //       $mX = 0;
  //       $mY = 0;
  //     }
  //   }
  // }

  // function unsubscribe() {
  //   emitter.off('call', onCall);
  // }

  // emitter.on('call', onCall);

  // onDestroy(unsubscribe);

  const release = new Date(data.release);
  const year = release.getFullYear().toString().substr(2);
  const month = release.getMonth() + 1;
</script>

<style>
.c-work {
  position: relative;
}

.c-work__header {
  display: grid;
  justify-items: center;
  text-align: center;
}

.c-work__release,
.c-work__title {
  display: inline-block;
  line-height: 1;
}

.c-work__month {
  display: none;
}

.c-work__media {
  grid-column-start: 3;
  grid-column-end: 11;
}

.c-work__placeholder {
  position: relative;
  height: 400px;
  background-color: var(--color-primary);
}

.c-work__media video {
  /* visibility: hidden; */
  /* transition: visibility 0.2s 0.3s; */
  display: none;
}

.c-work__media video.active {
  /* visibility: visible; */
}

.c-work__title,
.c-work__release,
.c-work__detail,
.c-work__media {
  opacity: 0;
  transform-style: preserve-3d;
  transition: all 1s var(--ease-in-out);
  transition-property: opacity, transform;
}

.c-work__release {
  transform-origin: top right;
  transform: translateY(30px) scaleY(1.2) skewY(-4deg);

  transition-delay: 0.25s;
}

.c-work__title {
  transform-origin: top left;
  transform: translateY(30px) scaleY(1.4) skewY(4deg);
}

.c-work__detail {
  transform: translateY(15px);
}

.c-work__detail:nth-child(1) {
  transition-delay: 0.15s;
}

.c-work__detail:nth-child(2) {
  grid-column-start: 6;
  transition-delay: 0.25s;
}

.c-work__detail:nth-child(3) {
  grid-column-start: 12;
  transition-delay: 0.35s;

  white-space: nowrap;
}

.c-work__media {
  transform: translateY(40px);

  transition-delay: .35s;
}

:global(.is-inview).c-work__header .c-work__title,
:global(.is-inview).c-work__header .c-work__release,
:global(.is-inview).c-work__details .c-work__detail,
:global(.is-inview).c-work__content .c-work__media {
  transform: none;
  opacity: 1;
}

@media screen and (min-width: 40em) {
  .c-work__header {
    grid-template-columns: repeat(10, 1fr);
    align-items: end;

    text-align: left;
  }

  .c-work__title {
    justify-self: start;

    grid-column-start: 1;
    grid-column-end: 4;

    transform: translateY(80px) scaleY(1.8) skewY(8deg);
  }

  .c-work__release {
    justify-self: end;

    grid-column-start: 9;
    grid-column-end: 11;

    transform: translateY(80px) scaleY(1.4) skewY(-8deg);
  }

  .c-work__month {
    display: block;
    text-align: right;
  }

  .c-work__media {
    grid-column-start: 1;
    grid-column-end: 13;
    
    /* transform: translateY(30%) skewY(4deg); */
    transform: translateY(30%) scale(1.05);
    transition-delay: 0s;
  }

  .c-work__placeholder {
    height: 600px;
  }

  .c-work__media video {
    display: block;
  }

  .c-work__media video + .c-work__placeholder {
    display: none;
  }

  .c-work__detail:nth-child(2) {
    grid-column-start: 4;
  }

  .c-work__detail:nth-child(3) {
    grid-column-start: 10;
  }
}
</style>

<svelte:window
  bind:innerWidth={vw}
  bind:innerHeight={vh}
/>

<article 
  class="c-work"
  data-scroll-section
>
  <header 
    class="c-work__header"
    data-scroll
    data-scroll-position="bottom"
    data-scroll-offset="150"
  >
    <h2 class="c-work__title">
      {PrismicDOM.RichText.asText(data.title)}
    </h2>
    <h4 class="c-work__release">
      <div class="c-work__month">{month}</div>
      <div class="c-work__year">{year}</div>
    </h4>
  </header>
  <Spacer size={3} only="mobile" />
  <Spacer size={8} only="desktop" />
  <div 
    class="l-grid c-work__content"
    data-scroll
    data-scroll-position="bottom"
    data-scroll-offset="100"
  >
    <div 
      data-scroll
      data-scroll-call="{CALL_VALUE}"
      data-scroll-repeat
      class="c-work__media"
      on:mousemove={onMouseMove}
    >
      {#if data.video.url}
        <video
          muted
          loop
          autoplay={isActive}
          preload="auto"
          class:active={isActive}
          style="transform: translate3d({$mX}px, {$mY}px, 0); transform-origin: 50% 50%;"
          src="{PrismicDOM.Link.url(data.video)}"
        />
      {/if}
      <div class="c-work__placeholder"></div>
    </div>
  </div>
  <Spacer size={6} />
  <div 
    class="c-work__details l-grid"
    data-scroll
  >
    <span class="c-work__detail">{PrismicDOM.RichText.asText(data.type)}</span>
    <span class="c-work__detail">{PrismicDOM.RichText.asText(data.role)}</span>
    <span class="c-work__detail"><a rel="noopener" target="_blank" href='{PrismicDOM.Link.url(data.link)}'>Visit Site</a></span>
  </div>
  <Spacer size={15} />
</article>