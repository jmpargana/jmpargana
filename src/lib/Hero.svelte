<script>
	import CatWalking from '../CatWalking.svelte';
	import CatRedResting from '../CatRedResting.svelte';
	import CatMostache from '../CatMostache.svelte';
  import Laser from './Laser.svelte'
  import HeroSection from './HeroSection.svelte'
  import BgSvg from './BgSvg.svelte'

  let scrollY
  $: opacity = scrollY < 300 ? 1 : 1 - scrollY / 500
</script>

<svelte:window bind:scrollY={scrollY} />

<div class="hero">
  <Laser />
  <HeroSection />
  <BgSvg />
	<div class="cat-walking">
		<CatWalking />
	</div>
	<div class="cat-mostache">
		<CatMostache />
	</div>
	<div style:opacity={opacity} class="cat-red-resting">
		<CatRedResting />
	</div>
</div>

<style>
.hero {
  height: 110vh;
}

.cat-walking {
  position: absolute;
  top: 80px;
  width: 100vw;
}

.cat-mostache {
  position:absolute; 
  top: 80px; 
  right: 100px
}

.cat-red-resting {
  position:absolute; 
  top: 800px; 
  left: 200px
}
</style>
