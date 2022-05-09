<script>
	import CatWalking from '../CatWalking.svelte';
	import CatRedResting from '../CatRedResting.svelte';
	import CatMostache from '../CatMostache.svelte';
  import Laser from './Laser.svelte'
  import HeroSection from './HeroSection.svelte'
  import BgSvg from './BgSvg.svelte'

  let scrollY
  $: opacity = scrollY < 100 ? 1 : 1 - scrollY / 300
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
  top: 250px;
  width: 100vw;
}

.cat-mostache {
  position:absolute; 
  top: 0;
  right: 0;
  pointer-events: none;
  transform: scale(0.6);
}


.cat-red-resting {
  position:absolute; 
  z-index: 10;
  top: 372px;
  left: 240px;
  transform: scale(0.4);
  pointer-events: none;
}

@media (min-width: 400px) {
  .cat-red-resting {
    left: 40px;
    top: 365px;
  }
}


@media (min-width: 800px) {
  .cat-red-resting {
    top: 389px; 
    left: 550px;
    transform: scale(1);
  }
  .cat-mostache {
    top: 80px; 
    right: 100px;
    transform: scale(1);
  }
  .cat-walking {
    top: 80px;
    width: 100vw;
    transform: scale(1);
  }


}

</style>
