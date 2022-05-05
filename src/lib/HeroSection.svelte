<script>
	let scrollY;

	$: translate = (ratio) => `translate3d(0, ${scrollY * ratio}px, 0)`;

	$: translateX = (ratio) => `translate3d(${scrollY * ratio}px, 0, 0)`;
</script>


<svelte:window bind:scrollY />

<div style:transform={translate(-0.2)} class="hero-content">
  <div class="hero-content-content">
    <div class="hero-left">
      <div class="name">
        <div class="name-top">
          <h1 class="letter" style:transform={translateX(3)}>Joao</h1>
        </div>
        <div class="name-bottom">
          <h1 class="letter" style:transform={translateX(-3)}>Pargana</h1>
        </div>
      </div>
      <div class="row" style:opacity={`${1 - scrollY / 100}`}>
        <span class="attrs">Developer</span>
        <span class="attrs">Musician</span>
        <span class="attrs">Cat Enthusiast</span>
      </div>
    </div>
  </div>
</div>

<style>
	.hero-content {
    pointer-events: none;
		position: relative;
    z-index: 10;
	}

	.hero-content-content {
		display: flex;
		position: relative;
	}

	.hero-left {
		margin-top: 14rem;
		margin-left: 8rem;
	}

	.letter {
		line-height: 14rem;
	}

	.row {
		margin-top: 4rem;
		display: flex;
		gap: 2rem;
	}

	span,
	h1 {
		color: white;
		cursor: pointer;
	}

	span:hover {
		color: var(--color-primary);
	}

	.attrs {
		color: white;
		font-weight: 700;
	}

</style>
