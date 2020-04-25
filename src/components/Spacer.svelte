<script>
  export let size;
  export let only = null;
</script>

<style>
  .o-spacer {
    height: calc(var(--gutter) * (var(--size)));
    font-size: 0;
    margin: 0;
    padding: 0;
  }

  .o-spacer--only-desktop {
    display: none;
  }

  @media screen and (min-width: 40em) {
    .o-spacer--only-desktop {
      display: block;
    }

    .o-spacer--only-mobile {
      display: none;
    }
  }
</style>

<div
  style="--size:{size}"
  class="o-spacer{only ? ` o-spacer--only-${only}` : ''}" />
