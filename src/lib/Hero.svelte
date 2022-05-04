<script>
  import Waver from './Waver.svelte'

  let scrollY

  $: translate = (ratio) =>
    `translate3d(0, ${scrollY * ratio}px, 0)`

</script>

<svelte:window bind:scrollY={scrollY} />

<div class="hero">
  <div style:transform={translate(-0.2)} class="hero-content">
    <div class="hero-content-content">
      <div class="hero-left">
        <div class="name">
          <div class="name-top">
            <h1 class="letter">Joao</h1>
          </div>
          <div class="name-bottom">
            <h1 class="letter">Pargana</h1>
          </div>
        </div>
        <div class="row" style:opacity={`${1 - scrollY / 100}`}>
          <span class="attrs">Developer</span>
          <span class="attrs">Musician</span>
          <span class="attrs">Linguist</span>
        </div>
      </div>
    </div>
    <div class="hero-img">
      <Waver />
    </div>
  </div>
  <div style:transform={translate(0.1)} class="box" />
</div>


<style>

.hero {
  background-color: #15172b;
}

.hero-content {
  position: relative;
  z-index: 10;

}

.hero-content-content {
  display: flex;
  position: relative;
  padding-top: 8rem;
  padding-left: 8rem;
  z-index: 30;
}

.letter {
  line-height: 14rem;
}


.row {
  margin-top: 4rem;
  display: flex;
  gap: 2rem;
}

span,h1 {
  color: white;
  cursor: pointer;
}


span:hover {
  color: var(--color-primary);
}

.box {
  /* TODO: media queries */
  height: 80vh;
  background-position: bottom;
  background-size: cover;
  background-repeat: no-repeat;
  /* position: absolute; */
  background-image: url('/hero-dark.svg');
}  

.attrs {
  color: var(--color-primary);
  font-weight: 700;
}

.hero-img {
  position: absolute;
  top: 20%;
  right: 10%;
}


</style>
