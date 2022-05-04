<script>
  import Fa from 'svelte-fa/src/fa.svelte'
  import { 
    faReact, 
    faVuejs, 
    faJs, 
    faGolang, 
    faNode, 
    faJava, 
    faAws, 
    faGit, 
    faGithub, 
    faLinux,
    faPaypal,
    faStackOverflow,
    faStripe,
  } from '@fortawesome/free-brands-svg-icons'


  const colors = [
    '#1ABC9C', 
    '#2ECC71', 
    '#3498DB', 
    '#9B59B6',
    '#34495E',
    '#16A085',
    '#27AE60',
    '#2980B9',
    '#8E44AD',
    '#2C3E50',
    '#F1C40F',
    '#E67E22',
    '#E74C3C',
    '#F39C12',
    '#D35400',
    '#C0392B',
    '#7F8C8D',

    '#A20025',
    '#6A00FF',
    '#D80073',
    '#825A2C',
    '#76608A',
    '#647687',
    '#6D8764',
    '#1BA1E2'
  ]

  const randomColor = () => colors[Math.floor(Math.random() * colors.length)]


</script>

<div id="infinite" class="highway-slider">
	<div class="container highway-barrier">
		<ul class="highway-lane">
			<li style:color={randomColor()} class="highway-car"><Fa icon={faPaypal} size="3x" /><span class="tech">Paypal</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faReact} size="3x" /><span class="tech">React</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faVuejs} size="3x" /><span class="tech">Vuejs</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faJs} size="3x" /><span class="tech">JavaScript</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faGolang} size="3x" /><span class="tech">Golang</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faNode} size="3x" /><span class="tech">Nodejs</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faJava} size="3x" /><span class="tech">Java</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faAws} size="3x" /><span class="tech">S3</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faGit} size="3x" /><span class="tech">Git</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faStackOverflow} size="3x" /><span class="tech">StackOverflow</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faLinux} size="3x" /><span class="tech">Linux</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faGithub} size="3x" /><span class="tech">GitHub</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faStripe} size="3x" /><span class="tech">Stripe</span></li>

			<li style:color={randomColor()} class="highway-car"><Fa icon={faPaypal} size="3x" /><span class="tech">Paypal</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faReact} size="3x" /><span class="tech">React</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faVuejs} size="3x" /><span class="tech">Vuejs</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faJs} size="3x" /><span class="tech">JavaScript</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faGolang} size="3x" /><span class="tech">Golang</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faNode} size="3x" /><span class="tech">Nodejs</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faJava} size="3x" /><span class="tech">Java</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faAws} size="3x" /><span class="tech">S3</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faGit} size="3x" /><span class="tech">Git</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faStackOverflow} size="3x" /><span class="tech">StackOverflow</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faLinux} size="3x" /><span class="tech">Linux</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faGithub} size="3x" /><span class="tech">GitHub</span></li>
			<li style:color={randomColor()} class="highway-car"><Fa icon={faStripe} size="3x" /><span class="tech">Stripe</span></li>
		</ul>
	</div>
</div>

<style>
	div.highway-slider {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	div.highway-slider div.highway-barrier {
		overflow: hidden;
		position: relative;
	}
	div.highway-slider ul.highway-lane {
		display: flex;
		height: 100%;
	}

	div.highway-slider ul.highway-lane li.highway-car {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		color: #343434;
	}

	@-webkit-keyframes translatestf {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-500%);
		}
	}

	@keyframes translatestf {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-500%);
		}
	}

	#stffull div.highway-barrier ul.highway-lane {
		width: 500%;
	}

	#stffull div.highway-barrier ul.highway-lane li.highway-car {
		-webkit-animation: translatestf 30s linear infinite;
		animation: translatestf 30s linear infinite;
	}

	@-webkit-keyframes translateinfinite {
		100% {
			transform: translateX(calc(-180px * 12));
		}
	}

	@keyframes translateinfinite {
		100% {
			transform: translateX(calc(-180px * 12));
		}
	}


	#infinite div.highway-barrier::before,
	#infinite div.highway-barrier::after {
		content: ' ';
		position: absolute;
		z-index: 9;
		width: 180px;
		height: 100%;
	}

	#infinite div.highway-barrier::before {
		top: 0;
		left: 0;
		background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
	}

	#infinite div.highway-barrier::after {
		top: 0;
		right: 0;
		background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
	}

	#infinite div.highway-barrier ul.highway-lane {
		width: calc(180px * 24);
	}

	#infinite div.highway-barrier ul.highway-lane li.highway-car {
		width: 180px;
		-webkit-animation: translateinfinite 25s linear infinite;
		animation: translateinfinite 25s linear infinite;
    display: flex;
    flex-direction: column;
    gap: 1rem;
	}

.tech {
  font-size: 1.5rem;
  font-family: var(--font-heading);
}


#infinite {
  --margin: 150px;
  margin-top: var(--margin);
  margin-bottom: var(--margin);
}

</style>
