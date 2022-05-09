<script>
  import Fa from 'svelte-fa/src/fa.svelte'
  import {faArrowRightLong} from '@fortawesome/free-solid-svg-icons/index.js'

  export let href="#"
</script>

<div class="link-container">
  <a class="link" target="_blank" href={href}>Visit Website</a>
  <div class="wrapper">
    <Fa class="icon" color="#e91e63" icon={faArrowRightLong} />
  </div>
</div>

<style>
.link-container {
  display: flex;
  align-items: center;
  width: 150px;
  justify-content: space-between;
  cursor: pointer;
}

.link-container:hover .wrapper {
  transform: translateX(20px);
}


.wrapper {
  transition: all 200ms linear;
}

.link {
  color: var(--color-primary);
  text-decoration: none !important;
} 
</style>
