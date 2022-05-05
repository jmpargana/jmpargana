<script>
	let scrollY;
	$: translate = (ratio) => `translate3d(0, ${scrollY * ratio}px, 0)`;
</script>

<svelte:window bind:scrollY />
<div class="wrapper" style:transform={translate(-2)}>
  <div class="top" />
  <div class="box" />
</div>

<style>

.wrapper {
  width: 100vw;
  position: absolute;
  top: 0;
}

.top {
  height: 80vh;
  background-color: #15172b;
  
}
.box {
  height: 80vh;
  background-position: bottom;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('/hero-dark.svg');
}
</style>

