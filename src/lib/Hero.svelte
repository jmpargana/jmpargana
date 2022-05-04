<script>
	import CatWalking from '../CatWalking.svelte';
	import CatHappy from '../CatHappy.svelte';
	import CatDogLeft from '../CatDogLeft.svelte';
	import CatDogRight from '../CatDogRight.svelte';
	import CatPirate from '../CatPirate.svelte';
	import CatRedResting from '../CatRedResting.svelte';
	import CatMostache from '../CatMostache.svelte';

	let scrollY;

	$: translate = (ratio) => `translate3d(0, ${scrollY * ratio}px, 0)`;

	$: translateX = (ratio) => `translate3d(${scrollY * ratio}px, 0, 0)`;
</script>

<svelte:window bind:scrollY />

<div class="hero">
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
	<div style:transform={translate(-2)} class="box" />

	<div style="width:100vw; position:absolute; top: 80px">
		<CatWalking />
	</div>

	<div style="position:absolute; top: 80px; right: 100px">
		<CatMostache />
	</div>


	<div style="position:absolute; top: 400px; left: 280px">
		<CatPirate />
	</div>


	<div style="position:absolute; top: 800px; left: 200px">
		<CatRedResting />
	</div>
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
		/* padding-top: 8rem; */
		/* padding-left: 8rem; */
		z-index: 30;
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
		color: white;
		/* color: var(--color-primary); */
		font-weight: 700;
	}
</style>
