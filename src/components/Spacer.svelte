<script>
  export let size;
</script>

<style>
  .o-spacer {
    display: block;
    height: calc( var( --spacer ) * ( var( --size ) / 2 ) );
    font-size: 0;
    margin: 0;
    padding: 0;
  }

  @media screen and (min-width: 40em) {
    .o-spacer {
      height: calc( var( --spacer ) * var( --size ) );
    }
  }
</style>

<div style="--size:{size}" class="o-spacer"></div>