<script context="module">
  import { scrollable } from '../context/scroll';
  import { lazyImage } from '../utils/lazy';
</script>

<script>
  export let uid;
  export let image;

  let imageElement;

  scrollable({
    value: uid,
    enter: async () => {
      const src = await lazyImage(imageElement);
    }
  });
</script>

<div class="glide__slide" data-scroll data-scroll-call={uid}>
  <img bind:this={imageElement} data-src={image.url} alt={image.alt} />
</div>