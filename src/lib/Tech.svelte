<script>
  /* import Fa from 'svelte-fa/src/fa.svelte' */
  /* import { */ 
  /*   faReact, */ 
  /*   faVuejs, */ 
  /*   faJs, */ 
  /*   faGolang, */ 
  /*   faNode, */ 
  /*   faJava, */ 
  /*   faAws, */ 
  /*   faGit, */ 
  /*   faGithub, */ 
  /*   faLinux, */
  /*   faPaypal, */
  /*   faStackOverflow, */
  /*   faStripe, */
  /* } from '@fortawesome/free-brands-svg-icons/index.js' */

  import FaPaypal from 'svelte-icons/fa/FaPaypal.svelte'
  import FaVuejs from 'svelte-icons/fa/FaVuejs.svelte'
  import FaJs from 'svelte-icons/fa/FaJs.svelte'
  import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
  import FaStackOverflow from 'svelte-icons/fa/FaStackOverflow.svelte'
  import FaGit from 'svelte-icons/fa/FaGit.svelte'
  import FaNode from 'svelte-icons/fa/FaNode.svelte'
  import FaAws from 'svelte-icons/fa/FaAws.svelte'
  import FaLinux from 'svelte-icons/fa/FaLinux.svelte'
  import FaReact from 'svelte-icons/fa/FaReact.svelte'
  import FaStripe from 'svelte-icons/fa/FaStripe.svelte'
  import FaJava from 'svelte-icons/fa/FaJava.svelte'
  import DiGo from 'svelte-icons/di/DiGo.svelte'
  


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

  const icons = [
{
  icon: FaPaypal,
  text: 'Paypal',
},
{
  icon: FaReact,
  text: 'React',
},
{
  icon: FaVuejs,
  text: 'Vuejs',
},
{
  icon: FaJs,
  text: 'JavaScript',
},
{
  icon: DiGo,
  text: 'Golang',
},
{
  icon: FaNode,
  text: 'Node',
},
{
  icon: FaJava,
  text: 'Java',
},
{
  icon: FaAws,
  text: 'Aws',
},
{
  icon: FaGit,
  text: 'Git',
},
{
  icon: FaStackOverflow,
  text: 'StackOverflow',
},
{
  icon: FaLinux,
  text: 'Linux',
},
{
  icon: FaGithub,
  text: 'Github',
},
{
  icon: FaStripe,
  text: 'Stripe',
},
  ]


</script>

<div id="infinite" class="highway-slider">
	<div class="container highway-barrier">
		<ul class="highway-lane">
      {#each icons as it}
			  <li style:color={randomColor()} class="highway-car"><div class="icon-wrapper"><svelte:component this={it.icon} /></div><span class="tech">{it.text}</span></li>
      {/each}

      {#each icons as it}
			  <li style:color={randomColor()} class="highway-car"><div class="icon-wrapper"><svelte:component this={it.icon} /></div><span class="tech">{it.text}</span></li>
      {/each}
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

.icon-wrapper {
  height: 51px;
}

</style>
