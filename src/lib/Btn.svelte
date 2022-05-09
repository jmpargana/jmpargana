<script>
  import Fa from 'svelte-fa/src/fa.svelte'
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

  export let label

</script>

<button class="button-wrapper" on:click>
  <div class="label">
    {label}
  </div>
  <div class="icon-wrapper">
    <Fa icon={faChevronRight} />
  </div>
</button>

<style>
.button-wrapper {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: #473bd4;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 200ms ease;
  width: 285px;
}

.icon-wrapper {
  border-radius: 50%;
  background-color: white;
  height: 44px;
  width: 44px;
  display: grid;
  place-items: center;
  color: #473bd4;;
  transition: all 400ms ease;
}

.button-wrapper:hover {
  background-color: rgba(71,59,212,.1);
  border-color: rgba(71,59,212,.1);
  color: #473bd4;
}

.button-wrapper:hover .icon-wrapper {
  transform: translate3d(-195px, 0, 0);
}

.label {
  transition: all 400ms ease;
}

.button-wrapper:hover .label {
  transform: translate3d(50px, 0, 0);
}


</style>
