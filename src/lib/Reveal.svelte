<script>
  import IntersectionObserver from 'svelte-intersection-observer'
  export let node
</script>


<IntersectionObserver once element={node} let:intersecting>
  <div bind:this={node}>
    {#if intersecting}
      <slot/>
    {/if}
  </div>
</IntersectionObserver>
