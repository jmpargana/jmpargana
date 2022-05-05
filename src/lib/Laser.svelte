<script>
  import { spring } from 'svelte/motion'
  import CatPirate from '../CatPirate.svelte'

  let coords = spring({ x: 50, y: 50 }, {
    stiffness: 0.5,
    damping: 0.3
  })

  let catCoords = spring({ x: 100, y: 100 }, {
    stiffness: 0.05,
    damping: 1
  })

  function setCoords(e) {
    coords.set({ x: e.clientX, y: e.clientY })
    catCoords.set({ x: e.clientX, y: e.clientY })
  }

</script>


<svg on:mousemove={setCoords}>
  <circle fill="red" cx={$coords.x} cy={$coords.y} r={3} />
</svg>

<div class="cat" style:top={`${$catCoords.y}px`} style:left={`${$catCoords.x}px`}>
  <CatPirate />
</div>


<style>
svg {
  width: 100vw;
  height: 100vh;
  z-index: 10;
  position: absolute;
  background-color: transparent;
}

.cat {
  position: absolute;
  width: 200px;
  z-index: 10;
}

</style>
